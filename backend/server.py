from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from config import MONGO_URL, DB_NAME

# Import routes
from routes.restaurants import router as restaurants_router
from routes.categories import router as categories_router
from routes.menu_items import router as menu_items_router
from routes.users import router as users_router
from routes.orders import router as orders_router

# MongoDB connection
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Create the main app
app = FastAPI(title="Vizinhando API", version="1.0.0")

# Include routers
app.include_router(restaurants_router)
app.include_router(categories_router)
app.include_router(menu_items_router)
app.include_router(users_router)
app.include_router(orders_router)

# Original API endpoints for compatibility
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "Vizinhando API is running!"}

# Include the compatibility router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    logger.info("Vizinhando API started successfully!")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()