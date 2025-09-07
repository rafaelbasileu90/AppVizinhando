# Vizinhando - Contratos de API e Integração Frontend/Backend

## 1. API Contracts

### Restaurants API
- `GET /api/restaurants` - Listar todos os restaurantes
- `GET /api/restaurants/:id` - Detalhes de um restaurante
- `GET /api/restaurants/category/:category` - Restaurantes por categoria
- `POST /api/restaurants` - Criar restaurante (admin)
- `PUT /api/restaurants/:id` - Atualizar restaurante (admin)
- `DELETE /api/restaurants/:id` - Deletar restaurante (admin)

### Categories API
- `GET /api/categories` - Listar todas as categorias

### Menu API
- `GET /api/restaurants/:id/menu` - Menu de um restaurante
- `POST /api/restaurants/:id/menu` - Adicionar item ao menu (restaurant owner)
- `PUT /api/menu-items/:id` - Atualizar item do menu (restaurant owner)
- `DELETE /api/menu-items/:id` - Deletar item do menu (restaurant owner)

### Orders API
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Detalhes de um pedido
- `PUT /api/orders/:id/status` - Atualizar status do pedido (restaurant owner)

### Users API
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login do usuário
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `POST /api/users/addresses` - Adicionar endereço
- `PUT /api/users/addresses/:id` - Atualizar endereço

### Restaurant Management API
- `POST /api/restaurant-auth/register` - Registrar restaurante
- `POST /api/restaurant-auth/login` - Login do restaurante
- `GET /api/restaurant-dashboard/orders` - Pedidos do restaurante
- `PUT /api/restaurant-dashboard/orders/:id` - Atualizar status do pedido

## 2. Data Models

### Restaurant
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "image": "string",
  "cuisine": "string",
  "rating": "number",
  "deliveryTime": "string",
  "deliveryFee": "number",
  "isOpen": "boolean",
  "promo": "string|null",
  "categories": ["string"],
  "address": {
    "street": "string",
    "city": "string",
    "postalCode": "string"
  },
  "contact": {
    "phone": "string",
    "email": "string"
  },
  "hours": {
    "open": "string",
    "close": "string"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### MenuItem
```json
{
  "_id": "ObjectId",
  "restaurantId": "ObjectId",
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string",
  "category": "string",
  "isAvailable": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Order
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "restaurantId": "ObjectId",
  "items": [{
    "menuItemId": "ObjectId",
    "name": "string",
    "price": "number",
    "quantity": "number"
  }],
  "deliveryAddress": {
    "street": "string",
    "city": "string",
    "postalCode": "string"
  },
  "paymentMethod": "string",
  "subtotal": "number",
  "deliveryFee": "number",
  "serviceFee": "number",
  "total": "number",
  "status": "string", // pending, confirmed, preparing, out_for_delivery, delivered, cancelled
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### User
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "string", // hashed
  "phone": "string",
  "addresses": [{
    "label": "string",
    "street": "string",
    "city": "string",
    "postalCode": "string",
    "isDefault": "boolean"
  }],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 3. Mock Data Replacement Plan

### Current Mock Data in `/frontend/src/data/mock.js`:
- `mockRestaurants` → Replace with API call to `/api/restaurants`
- `mockCategories` → Replace with API call to `/api/categories`
- `mockMenuItems` → Replace with API call to `/api/restaurants/:id/menu`
- `mockUser` → Replace with authenticated user data from `/api/users/profile`
- `mockOrders` → Replace with API call to `/api/orders`
- `paymentMethods` → Keep as static data (configuration)

## 4. Frontend Integration Points

### Components to Update:
1. **App.js** - Add API service and authentication context
2. **RestaurantGrid.jsx** - Replace mock restaurants with API data
3. **RestaurantDetail.jsx** - Fetch restaurant and menu data from API
4. **CategorySlider.jsx** - Fetch categories from API
5. **Cart.jsx** - Send order data to API
6. **Header.jsx** - Add authentication state

### API Service Layer:
Create `/frontend/src/services/api.js` with:
- Restaurant services
- Menu services
- Order services
- User services
- Authentication services

## 5. Authentication Flow

### User Authentication:
1. Register/Login forms
2. JWT token storage in localStorage
3. Protected routes for user profile/orders
4. Automatic token refresh

### Restaurant Authentication:
1. Separate restaurant login/dashboard
2. Restaurant-specific routes
3. Order management interface
4. Menu management interface

## 6. Backend Implementation Priority

1. **Phase 1**: Basic CRUD operations
   - Restaurants API
   - Categories API
   - Menu API

2. **Phase 2**: User management
   - User registration/login
   - User profile management
   - Address management

3. **Phase 3**: Order processing
   - Order creation
   - Order status tracking
   - Payment integration (MBWay simulation)

4. **Phase 4**: Restaurant management
   - Restaurant dashboard
   - Order management
   - Menu management

## 7. Error Handling

- Consistent error response format
- Loading states in frontend
- Offline handling
- Validation errors display

## 8. Security Considerations

- JWT authentication
- Password hashing
- Input validation
- Rate limiting
- CORS configuration