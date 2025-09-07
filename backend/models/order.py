from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from .restaurant import PyObjectId, Address

class OrderItem(BaseModel):
    menuItemId: PyObjectId
    name: str
    price: float
    quantity: int

class Order(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    userId: PyObjectId
    restaurantId: PyObjectId
    items: List[OrderItem]
    deliveryAddress: Address
    paymentMethod: str
    subtotal: float
    deliveryFee: float
    serviceFee: float
    total: float
    status: str = "pending"  # pending, confirmed, preparing, out_for_delivery, delivered, cancelled
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class OrderCreate(BaseModel):
    restaurantId: str
    items: List[OrderItem]
    deliveryAddress: Address
    paymentMethod: str
    subtotal: float
    deliveryFee: float
    serviceFee: float
    total: float

class OrderStatusUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: str
    userId: str
    restaurantId: str
    restaurantName: str
    items: List[OrderItem]
    deliveryAddress: Address
    paymentMethod: str
    subtotal: float
    deliveryFee: float
    serviceFee: float
    total: float
    status: str
    createdAt: datetime
    updatedAt: datetime