from fastapi import APIRouter, HTTPException
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
import os
from models.category import Category, CategoryCreate

router = APIRouter(prefix="/api/categories", tags=["categories"])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.get("/", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    categories = await db.categories.find().to_list(100)
    return [Category(**category) for category in categories]

@router.post("/", response_model=Category)
async def create_category(category: CategoryCreate):
    """Create a new category"""
    category_dict = category.dict()
    
    result = await db.categories.insert_one(category_dict)
    created_category = await db.categories.find_one({"_id": result.inserted_id})
    
    return Category(**created_category)