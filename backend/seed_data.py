from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_categories():
    """Seed categories data"""
    categories = [
        {"name": "Promocões", "icon": "🔥", "color": "#ff6b6b", "createdAt": datetime.utcnow(), "updatedAt": datetime.utcnow()},
        {"name": "Portuguesa", "icon": "🇵🇹", "color": "#28c76f", "createdAt": datetime.utcnow(), "updatedAt": datetime.utcnow()},
        {"name": "Pizza", "icon": "🍕", "color": "#ff9f43", "createdAt": datetime.utcnow(), "updatedAt": datetime.utcnow()},
        {"name": "Sushi", "icon": "🍣", "color": "#17a2b8", "createdAt": datetime.utcnow(), "updatedAt": datetime.utcnow()},
        {"name": "Hambúrgueres", "icon": "🍔", "color": "#ffc107", "createdAt": datetime.utcnow(), "updatedAt": datetime.utcnow()},
        {"name": "Doces", "icon": "🧁", "color": "#e83e8c", "createdAt": datetime.utcnow(), "updatedAt": datetime.utcnow()},
        {"name": "Bebidas", "icon": "🥤", "color": "#6f42c1", "createdAt": datetime.utcnow(), "updatedAt": datetime.utcnow()},
        {"name": "Vegetariano", "icon": "🥗", "color": "#20c997", "createdAt": datetime.utcnow(), "updatedAt": datetime.utcnow()}
    ]
    
    # Clear existing categories
    await db.categories.delete_many({})
    
    # Insert new categories
    await db.categories.insert_many(categories)
    print("Categories seeded successfully!")

async def seed_restaurants():
    """Seed restaurants data"""
    restaurants = [
        {
            "name": "Taberna Real",
            "description": "Autêntica cozinha portuguesa com pratos tradicionais",
            "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
            "cuisine": "Portuguesa",
            "rating": 4.8,
            "deliveryTime": "25-35 min",
            "deliveryFee": 2.50,
            "isOpen": True,
            "promo": "Desconto de 20%",
            "categories": ["Tradicional", "Grelhados"],
            "address": {
                "street": "Rua das Flores, 123",
                "city": "Lisboa",
                "postalCode": "1200-192"
            },
            "contact": {
                "phone": "+351 912 345 678",
                "email": "taberna@real.pt"
            },
            "hours": {
                "open": "11:00",
                "close": "23:00"
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Pizza da Nonna",
            "description": "Pizzas artesanais no forno a lenha",
            "image": "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=400",
            "cuisine": "Italiana",
            "rating": 4.6,
            "deliveryTime": "30-40 min",
            "deliveryFee": 1.99,
            "isOpen": True,
            "promo": None,
            "categories": ["Pizza", "Massa"],
            "address": {
                "street": "Avenida da República, 456",
                "city": "Lisboa",
                "postalCode": "1050-196"
            },
            "contact": {
                "phone": "+351 913 456 789",
                "email": "pizza@nonna.pt"
            },
            "hours": {
                "open": "12:00",
                "close": "24:00"
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Sushi Zen",
            "description": "Sushi fresco e sashimi premium",
            "image": "https://images.pexels.com/photos/3023476/pexels-photo-3023476.jpeg?w=400",
            "cuisine": "Japonesa",
            "rating": 4.9,
            "deliveryTime": "40-50 min",
            "deliveryFee": 3.50,
            "isOpen": True,
            "promo": "Oferta: 2x1 em makis",
            "categories": ["Sushi", "Asiática"],
            "address": {
                "street": "Rua do Ouro, 789",
                "city": "Lisboa",
                "postalCode": "1100-061"
            },
            "contact": {
                "phone": "+351 914 567 890",
                "email": "sushi@zen.pt"
            },
            "hours": {
                "open": "18:00",
                "close": "01:00"
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Burger House",
            "description": "Hambúrgueres gourmet com ingredientes frescos",
            "image": "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=400",
            "cuisine": "Hambúrgueres",
            "rating": 4.4,
            "deliveryTime": "20-30 min",
            "deliveryFee": 1.50,
            "isOpen": False,
            "promo": None,
            "categories": ["Fast Food", "Hambúrgueres"],
            "address": {
                "street": "Largo do Chiado, 12",
                "city": "Lisboa",
                "postalCode": "1200-108"
            },
            "contact": {
                "phone": "+351 915 678 901",
                "email": "burger@house.pt"
            },
            "hours": {
                "open": "11:30",
                "close": "22:30"
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "Cantina do Bairro",
            "description": "Comida caseira portuguesa como a da avó",
            "image": "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=400",
            "cuisine": "Portuguesa",
            "rating": 4.7,
            "deliveryTime": "35-45 min",
            "deliveryFee": 2.00,
            "isOpen": True,
            "promo": "Entrega grátis",
            "categories": ["Tradicional", "Caseira"],
            "address": {
                "street": "Travessa do Fado, 34",
                "city": "Lisboa",
                "postalCode": "1170-145"
            },
            "contact": {
                "phone": "+351 916 789 012",
                "email": "cantina@bairro.pt"
            },
            "hours": {
                "open": "10:00",
                "close": "22:00"
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    # Clear existing restaurants
    await db.restaurants.delete_many({})
    
    # Insert restaurants and get their IDs
    result = await db.restaurants.insert_many(restaurants)
    restaurant_ids = result.inserted_ids
    print("Restaurants seeded successfully!")
    
    return restaurant_ids

async def seed_menu_items(restaurant_ids):
    """Seed menu items for restaurants"""
    menu_items = [
        # Taberna Real items
        {
            "restaurantId": restaurant_ids[0],
            "name": "Bacalhau à Brás",
            "description": "Bacalhau desfiado com batata palha, ovos e azeitonas",
            "price": 14.50,
            "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300",
            "category": "Pratos Principais",
            "isAvailable": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "restaurantId": restaurant_ids[0],
            "name": "Francesinha",
            "description": "Sanduíche tradicional do Porto com molho especial",
            "price": 12.90,
            "image": "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=300",
            "category": "Pratos Principais",
            "isAvailable": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "restaurantId": restaurant_ids[0],
            "name": "Pastéis de Nata",
            "description": "Famosos pastéis de nata portugueses (6 unidades)",
            "price": 7.50,
            "image": "https://images.pexels.com/photos/3023476/pexels-photo-3023476.jpeg?w=300",
            "category": "Sobremesas",
            "isAvailable": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        # Pizza da Nonna items
        {
            "restaurantId": restaurant_ids[1],
            "name": "Pizza Margherita",
            "description": "Molho de tomate, mozzarella e manjericão fresco",
            "price": 11.90,
            "image": "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=300",
            "category": "Pizzas",
            "isAvailable": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "restaurantId": restaurant_ids[1],
            "name": "Pizza Quattro Stagioni",
            "description": "Presunto, cogumelos, alcachofras e azeitonas",
            "price": 15.90,
            "image": "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=300",
            "category": "Pizzas",
            "isAvailable": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        # Sushi Zen items
        {
            "restaurantId": restaurant_ids[2],
            "name": "Combinado Sushi 20 peças",
            "description": "Seleção de sushi e sashimi do chef",
            "price": 24.90,
            "image": "https://images.pexels.com/photos/3023476/pexels-photo-3023476.jpeg?w=300",
            "category": "Combinados",
            "isAvailable": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "restaurantId": restaurant_ids[2],
            "name": "Temaki Salmão",
            "description": "Cone de alga com salmão, abacate e pepino",
            "price": 6.50,
            "image": "https://images.pexels.com/photos/3023476/pexels-photo-3023476.jpeg?w=300",
            "category": "Temaki",
            "isAvailable": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    # Clear existing menu items
    await db.menu_items.delete_many({})
    
    # Insert menu items
    await db.menu_items.insert_many(menu_items)
    print("Menu items seeded successfully!")

async def main():
    """Main seeding function"""
    print("Starting database seeding...")
    
    await seed_categories()
    restaurant_ids = await seed_restaurants()
    await seed_menu_items(restaurant_ids)
    
    print("Database seeding completed!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())