from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from models.restaurant import Restaurant, RestaurantCreate, RestaurantUpdate
from models.menu_item import MenuItem
from config import MONGO_URL, DB_NAME

router = APIRouter(prefix="/api/restaurants", tags=["restaurants"])

# MongoDB connection
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

@router.get("/", response_model=List[Restaurant])
async def get_restaurants(category: Optional[str] = None, search: Optional[str] = None):
    """Get all restaurants, optionally filtered by category or search term"""
    query = {}
    
    if category and category != "all":
        if category == "Promocões":
            query["promo"] = {"$ne": None}
        else:
            query["$or"] = [
                {"cuisine": {"$regex": category, "$options": "i"}},
                {"categories": {"$in": [category]}}
            ]
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"cuisine": {"$regex": search, "$options": "i"}}
        ]
    
    restaurants = await db.restaurants.find(query).to_list(1000)
    return [Restaurant(**restaurant) for restaurant in restaurants]

@router.get("/{restaurant_id}", response_model=Restaurant)
async def get_restaurant(restaurant_id: str):
    """Get a specific restaurant by ID"""
    if not ObjectId.is_valid(restaurant_id):
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")
    
    restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id)})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    return Restaurant(**restaurant)

@router.post("/", response_model=Restaurant)
async def create_restaurant(restaurant: RestaurantCreate):
    """Create a new restaurant"""
    restaurant_dict = restaurant.dict()
    restaurant_dict["createdAt"] = restaurant_dict["updatedAt"] = datetime.utcnow()
    
    result = await db.restaurants.insert_one(restaurant_dict)
    created_restaurant = await db.restaurants.find_one({"_id": result.inserted_id})
    
    return Restaurant(**created_restaurant)

@router.put("/{restaurant_id}", response_model=Restaurant)
async def update_restaurant(restaurant_id: str, restaurant_update: RestaurantUpdate):
    """Update a restaurant"""
    if not ObjectId.is_valid(restaurant_id):
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")
    
    update_data = {k: v for k, v in restaurant_update.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await db.restaurants.update_one(
        {"_id": ObjectId(restaurant_id)}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    updated_restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id)})
    return Restaurant(**updated_restaurant)

@router.delete("/{restaurant_id}")
async def delete_restaurant(restaurant_id: str):
    """Delete a restaurant"""
    if not ObjectId.is_valid(restaurant_id):
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")
    
    result = await db.restaurants.delete_one({"_id": ObjectId(restaurant_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    return {"message": "Restaurant deleted successfully"}

@router.get("/{restaurant_id}/menu")
async def get_restaurant_menu(restaurant_id: str):
    """Get menu items for a specific restaurant"""
    if not ObjectId.is_valid(restaurant_id):
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")
    
    menu_items = await db.menu_items.find({"restaurantId": ObjectId(restaurant_id)}).to_list(1000)
    return menu_items