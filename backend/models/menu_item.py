from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from .restaurant import PyObjectId

class MenuItem(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    restaurantId: PyObjectId
    name: str
    description: str
    price: float
    image: str
    category: str
    isAvailable: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class MenuItemCreate(BaseModel):
    restaurantId: str
    name: str
    description: str
    price: float
    image: str
    category: str
    isAvailable: bool = True

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    category: Optional[str] = None
    isAvailable: Optional[bool] = None