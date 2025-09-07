import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MapPin, Search, ShoppingCart, User, Menu, X } from 'lucide-react';

const Header = ({ cartItems = [], onLocationClick, onCartClick, onUserClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-red-600">
              Vizinhando
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 max-w-2xl mx-8">
            {/* Location */}
            <button 
              onClick={onLocationClick}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <MapPin className="h-5 w-5" />
              <span className="text-sm">Lisboa, Portugal</span>
            </button>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar restaurantes ou pratos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                  {cartItemsCount}
                </Badge>
              )}
            </button>

            {/* User */}
            <Button 
              variant="outline" 
              onClick={onUserClick}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Entrar</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-red-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar restaurantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Mobile Location */}
              <button 
                onClick={onLocationClick}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 w-full"
              >
                <MapPin className="h-5 w-5" />
                <span>Lisboa, Portugal</span>
              </button>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={onCartClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Carrinho ({cartItemsCount})</span>
                </button>

                <Button variant="outline" onClick={onUserClick}>
                  Entrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;