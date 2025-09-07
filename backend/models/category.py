from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from .restaurant import PyObjectId

class Category(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    icon: str
    color: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CategoryCreate(BaseModel):
    name: str
    icon: str
    color: str

class CategoryUpdate(BaseModel):
    name: str = None
    icon: str = None
    color: str = None