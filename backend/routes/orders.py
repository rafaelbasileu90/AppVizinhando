from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from models.order import Order, OrderCreate, OrderStatusUpdate, OrderResponse
from models.user import User
from services.auth import verify_token
from config import MONGO_URL, DB_NAME

router = APIRouter(prefix="/api/orders", tags=["orders"])
security = HTTPBearer()

# MongoDB connection
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    email = verify_token(token)
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return User(**user)

@router.post("/", response_model=OrderResponse)
async def create_order(order: OrderCreate, current_user: User = Depends(get_current_user)):
    """Create a new order"""
    # Convert string restaurantId to ObjectId
    restaurant_id = ObjectId(order.restaurantId)
    
    # Get restaurant info for response
    restaurant = await db.restaurants.find_one({"_id": restaurant_id})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Convert order items menuItemId strings to ObjectIds
    items_with_object_ids = []
    for item in order.items:
        item_dict = item.dict()
        item_dict["menuItemId"] = ObjectId(item_dict["menuItemId"])
        items_with_object_ids.append(item_dict)
    
    order_dict = order.dict()
    order_dict["userId"] = current_user.id
    order_dict["restaurantId"] = restaurant_id
    order_dict["items"] = items_with_object_ids
    order_dict["status"] = "pending"
    order_dict["createdAt"] = order_dict["updatedAt"] = datetime.utcnow()
    
    result = await db.orders.insert_one(order_dict)
    created_order = await db.orders.find_one({"_id": result.inserted_id})
    
    return OrderResponse(
        id=str(created_order["_id"]),
        userId=str(created_order["userId"]),
        restaurantId=str(created_order["restaurantId"]),
        restaurantName=restaurant["name"],
        items=created_order["items"],
        deliveryAddress=created_order["deliveryAddress"],
        paymentMethod=created_order["paymentMethod"],
        subtotal=created_order["subtotal"],
        deliveryFee=created_order["deliveryFee"],
        serviceFee=created_order["serviceFee"],
        total=created_order["total"],
        status=created_order["status"],
        createdAt=created_order["createdAt"],
        updatedAt=created_order["updatedAt"]
    )

@router.get("/", response_model=List[OrderResponse])
async def get_user_orders(current_user: User = Depends(get_current_user)):
    """Get all orders for the current user"""
    orders = await db.orders.find({"userId": current_user.id}).sort("createdAt", -1).to_list(100)
    
    order_responses = []
    for order in orders:
        # Get restaurant name
        restaurant = await db.restaurants.find_one({"_id": order["restaurantId"]})
        restaurant_name = restaurant["name"] if restaurant else "Unknown Restaurant"
        
        order_responses.append(OrderResponse(
            id=str(order["_id"]),
            userId=str(order["userId"]),
            restaurantId=str(order["restaurantId"]),
            restaurantName=restaurant_name,
            items=order["items"],
            deliveryAddress=order["deliveryAddress"],
            paymentMethod=order["paymentMethod"],
            subtotal=order["subtotal"],
            deliveryFee=order["deliveryFee"],
            serviceFee=order["serviceFee"],
            total=order["total"],
            status=order["status"],
            createdAt=order["createdAt"],
            updatedAt=order["updatedAt"]
        ))
    
    return order_responses

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, current_user: User = Depends(get_current_user)):
    """Get a specific order"""
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid order ID")
    
    order = await db.orders.find_one({"_id": ObjectId(order_id), "userId": current_user.id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Get restaurant name
    restaurant = await db.restaurants.find_one({"_id": order["restaurantId"]})
    restaurant_name = restaurant["name"] if restaurant else "Unknown Restaurant"
    
    return OrderResponse(
        id=str(order["_id"]),
        userId=str(order["userId"]),
        restaurantId=str(order["restaurantId"]),
        restaurantName=restaurant_name,
        items=order["items"],
        deliveryAddress=order["deliveryAddress"],
        paymentMethod=order["paymentMethod"],
        subtotal=order["subtotal"],
        deliveryFee=order["deliveryFee"],
        serviceFee=order["serviceFee"],
        total=order["total"],
        status=order["status"],
        createdAt=order["createdAt"],
        updatedAt=order["updatedAt"]
    )

@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status_update: OrderStatusUpdate):
    """Update order status (for restaurant owners)"""
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid order ID")
    
    valid_statuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status_update.status, "updatedAt": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": f"Order status updated to {status_update.status}"}