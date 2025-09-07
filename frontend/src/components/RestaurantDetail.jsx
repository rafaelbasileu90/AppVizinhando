import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Truck, 
  MapPin, 
  Plus, 
  Minus,
  ShoppingCart,
  Info
} from 'lucide-react';
import { mockMenuItems } from '../data/mock';

const RestaurantDetail = ({ restaurant, onBack, onAddToCart }) => {
  const [cartItems, setCartItems] = useState({});
  const menuItems = mockMenuItems[restaurant.id] || [];

  const updateCartItem = (itemId, change) => {
    setCartItems(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + change);
      
      if (newQty === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [itemId]: newQty };
    });
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cartItems).reduce((sum, [itemId, qty]) => {
      const item = menuItems.find(item => item.id === parseInt(itemId));
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const handleCheckout = () => {
    const orderItems = Object.entries(cartItems).map(([itemId, qty]) => {
      const item = menuItems.find(item => item.id === parseInt(itemId));
      return { ...item, quantity: qty };
    });
    
    onAddToCart(orderItems);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </button>

            {getTotalItems() > 0 && (
              <Button
                onClick={handleCheckout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Ver Carrinho ({getTotalItems()})</span>
                <span>€{getTotalPrice().toFixed(2)}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Hero */}
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg mb-4">{restaurant.description}</p>
            
            <div className="flex flex-wrap items-center space-x-6">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-5 w-5" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="h-5 w-5" />
                <span>€{restaurant.deliveryFee.toFixed(2)} entrega</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
              
              {menuItems.length > 0 ? (
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="flex-1 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 mb-3">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-gray-900">
                                €{item.price.toFixed(2)}
                              </span>
                              
                              <div className="flex items-center space-x-3">
                                {cartItems[item.id] > 0 && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => updateCartItem(item.id, -1)}
                                      className="h-8 w-8"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="font-medium min-w-[20px] text-center">
                                      {cartItems[item.id]}
                                    </span>
                                  </>
                                )}
                                <Button
                                  onClick={() => updateCartItem(item.id, 1)}
                                  className="h-8 px-3 bg-red-600 hover:bg-red-700"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="w-32 h-32">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Menu em breve
                  </h3>
                  <p className="text-gray-600">
                    O restaurante ainda não disponibilizou o menu.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Informações</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Rua Example, 123, Lisboa
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Aberto: 11:00 - 23:00
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
                <div className="flex flex-wrap gap-2">
                  {restaurant.categories.map((category, index) => (
                    <Badge key={index} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Promotions */}
            {restaurant.promo && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-800 mb-2">Promoção</h3>
                  <p className="text-red-700">{restaurant.promo}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;