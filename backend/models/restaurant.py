from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class Address(BaseModel):
    street: str
    city: str
    postalCode: str

class Contact(BaseModel):
    phone: str
    email: str

class Hours(BaseModel):
    open: str
    close: str

class Restaurant(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: str
    image: str
    cuisine: str
    rating: float
    deliveryTime: str
    deliveryFee: float
    isOpen: bool = True
    promo: Optional[str] = None
    categories: List[str]
    address: Address
    contact: Contact
    hours: Hours
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class RestaurantCreate(BaseModel):
    name: str
    description: str
    image: str
    cuisine: str
    rating: float = 0.0
    deliveryTime: str
    deliveryFee: float
    isOpen: bool = True
    promo: Optional[str] = None
    categories: List[str]
    address: Address
    contact: Contact
    hours: Hours

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    cuisine: Optional[str] = None
    rating: Optional[float] = None
    deliveryTime: Optional[str] = None
    deliveryFee: Optional[float] = None
    isOpen: Optional[bool] = None
    promo: Optional[str] = None
    categories: Optional[List[str]] = None
    address: Optional[Address] = None
    contact: Optional[Contact] = None
    hours: Optional[Hours] = None