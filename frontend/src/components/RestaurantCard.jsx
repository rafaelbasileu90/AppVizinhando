import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, Clock, Truck, Tag } from 'lucide-react';

const RestaurantCard = ({ restaurant, onClick }) => {
  const formatDeliveryFee = (fee) => {
    return fee === 0 ? 'Grátis' : `€${fee.toFixed(2)}`;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => onClick(restaurant)}
    >
      {/* Restaurant Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Overlay */}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-white text-gray-900">
              Fechado
            </Badge>
          </div>
        )}

        {/* Promo Badge */}
        {restaurant.promo && restaurant.isOpen && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-600 text-white font-medium">
              <Tag className="h-3 w-3 mr-1" />
              {restaurant.promo}
            </Badge>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white text-gray-900 font-medium">
            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-current" />
            {restaurant.rating}
          </Badge>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-sm text-gray-600">{restaurant.description}</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.categories.map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        {/* Delivery Info */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Truck className="h-4 w-4" />
              <span>{formatDeliveryFee(restaurant.deliveryFee)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Button 
            className={`w-full ${
              restaurant.isOpen 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!restaurant.isOpen}
          >
            {restaurant.isOpen ? 'Ver Menu' : 'Fechado'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;