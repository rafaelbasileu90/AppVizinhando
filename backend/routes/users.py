from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import os
from models.user import User, UserCreate, UserLogin, UserUpdate, UserResponse, Token, UserAddress
from services.auth import verify_password, get_password_hash, create_access_token, verify_token

router = APIRouter(prefix="/api/users", tags=["users"])
security = HTTPBearer()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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

@router.post("/register", response_model=Token)
async def register_user(user: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict["createdAt"] = user_dict["updatedAt"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    """Login user"""
    user = await db.users.find_one({"email": user_credentials.email})
    if not user or not verify_password(user_credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        addresses=current_user.addresses,
        createdAt=current_user.createdAt,
        updatedAt=current_user.updatedAt
    )

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(user_update: UserUpdate, current_user: User = Depends(get_current_user)):
    """Update user profile"""
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    
    await db.users.update_one(
        {"_id": current_user.id}, 
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"_id": current_user.id})
    user_obj = User(**updated_user)
    
    return UserResponse(
        id=str(user_obj.id),
        name=user_obj.name,
        email=user_obj.email,
        phone=user_obj.phone,
        addresses=user_obj.addresses,
        createdAt=user_obj.createdAt,
        updatedAt=user_obj.updatedAt
    )

@router.post("/addresses")
async def add_user_address(address: UserAddress, current_user: User = Depends(get_current_user)):
    """Add a new address for the user"""
    # If this is the first address or marked as default, make it default
    if not current_user.addresses or address.isDefault:
        # Unset other default addresses
        await db.users.update_one(
            {"_id": current_user.id},
            {"$set": {"addresses.$[].isDefault": False}}
        )
        address.isDefault = True
    
    await db.users.update_one(
        {"_id": current_user.id},
        {"$push": {"addresses": address.dict()}}
    )
    
    return {"message": "Address added successfully"}

@router.put("/addresses/{address_index}")
async def update_user_address(address_index: int, address: UserAddress, current_user: User = Depends(get_current_user)):
    """Update a user address"""
    if address_index >= len(current_user.addresses):
        raise HTTPException(status_code=404, detail="Address not found")
    
    # If marking as default, unset other defaults
    if address.isDefault:
        await db.users.update_one(
            {"_id": current_user.id},
            {"$set": {"addresses.$[].isDefault": False}}
        )
    
    await db.users.update_one(
        {"_id": current_user.id},
        {"$set": {f"addresses.{address_index}": address.dict()}}
    )
    
    return {"message": "Address updated successfully"}