from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from models.menu_item import MenuItem, MenuItemCreate, MenuItemUpdate
from config import MONGO_URL, DB_NAME

router = APIRouter(prefix="/api/menu-items", tags=["menu-items"])

# MongoDB connection
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

@router.post("/", response_model=MenuItem)
async def create_menu_item(menu_item: MenuItemCreate):
    """Create a new menu item"""
    menu_item_dict = menu_item.dict()
    menu_item_dict["restaurantId"] = ObjectId(menu_item_dict["restaurantId"])
    menu_item_dict["createdAt"] = menu_item_dict["updatedAt"] = datetime.utcnow()
    
    result = await db.menu_items.insert_one(menu_item_dict)
    created_item = await db.menu_items.find_one({"_id": result.inserted_id})
    
    return MenuItem(**created_item)

@router.get("/{item_id}", response_model=MenuItem)
async def get_menu_item(item_id: str):
    """Get a specific menu item"""
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid menu item ID")
    
    item = await db.menu_items.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    return MenuItem(**item)

@router.put("/{item_id}", response_model=MenuItem)
async def update_menu_item(item_id: str, item_update: MenuItemUpdate):
    """Update a menu item"""
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid menu item ID")
    
    update_data = {k: v for k, v in item_update.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await db.menu_items.update_one(
        {"_id": ObjectId(item_id)}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    updated_item = await db.menu_items.find_one({"_id": ObjectId(item_id)})
    return MenuItem(**updated_item)

@router.delete("/{item_id}")
async def delete_menu_item(item_id: str):
    """Delete a menu item"""
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid menu item ID")
    
    result = await db.menu_items.delete_one({"_id": ObjectId(item_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    return {"message": "Menu item deleted successfully"}