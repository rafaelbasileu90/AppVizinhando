from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from .restaurant import PyObjectId

class UserAddress(BaseModel):
    label: str
    street: str
    city: str
    postalCode: str
    isDefault: bool = False

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: EmailStr
    password: str  # This will be hashed
    phone: str
    addresses: List[UserAddress] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: str
    addresses: List[UserAddress] = []
    createdAt: datetime
    updatedAt: datetime

class Token(BaseModel):
    access_token: str
    token_type: str