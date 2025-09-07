import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategorySlider from './components/CategorySlider';
import RestaurantGrid from './components/RestaurantGrid';
import RestaurantDetail from './components/RestaurantDetail';
import Cart from './components/Cart';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const { toast } = useToast();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentView('restaurants');
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant-detail');
  };

  const handleAddToCart = (items) => {
    setCartItems(items);
    setCurrentView('cart');
    toast({
      title: "Adicionado ao carrinho!",
      description: `${items.length} item(s) adicionado(s) ao seu carrinho.`,
    });
  };

  const handleCartClick = () => {
    setCurrentView('cart');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
    setSelectedRestaurant(null);
  };

  const handleBackToRestaurants = () => {
    setCurrentView('restaurants');
    setSelectedRestaurant(null);
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index);
    } else {
      const updatedItems = [...cartItems];
      updatedItems[index].quantity = newQuantity;
      setCartItems(updatedItems);
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    toast({
      title: "Item removido",
      description: "Item removido do carrinho.",
    });
  };

  const handleCheckout = (orderData) => {
    console.log('Processing order:', orderData);
    toast({
      title: "Pedido realizado!",
      description: "Seu pedido foi enviado para o restaurante.",
    });
    setCartItems([]);
    setCurrentView('home');
  };

  const handleUserClick = () => {
    toast({
      title: "Login",
      description: "Funcionalidade de login será implementada em breve.",
    });
  };

  const handleLocationClick = () => {
    toast({
      title: "Localização",
      description: "Seleção de localização será implementada em breve.",
    });
  };

  const handleSearchClick = () => {
    toast({
      title: "Busca",
      description: "Funcionalidade de busca será implementada em breve.",
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'restaurant-detail':
        return (
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onBack={handleBackToRestaurants}
            onAddToCart={handleAddToCart}
          />
        );
      case 'cart':
        return (
          <Cart
            cartItems={cartItems}
            onBack={currentView === 'cart' && selectedRestaurant ? handleBackToRestaurants : handleBackToHome}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        );
      case 'restaurants':
        return (
          <>
            <Header
              cartItems={cartItems}
              onLocationClick={handleLocationClick}
              onCartClick={handleCartClick}
              onUserClick={handleUserClick}
            />
            <RestaurantGrid
              selectedCategory={selectedCategory}
              onRestaurantClick={handleRestaurantClick}
            />
            <footer className="bg-gray-900 text-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500 mb-4">Vizinhando</div>
                  <p className="text-gray-400">Comida deliciosa ao seu alcance</p>
                  <div className="mt-6 text-sm text-gray-500">
                    © 2024 Vizinhando Portugal. Todos os direitos reservados.
                  </div>
                </div>
              </div>
            </footer>
          </>
        );
      default:
        return (
          <>
            <Header
              cartItems={cartItems}
              onLocationClick={handleLocationClick}
              onCartClick={handleCartClick}
              onUserClick={handleUserClick}
            />
            <HeroSection
              onSearchClick={handleSearchClick}
              onLocationClick={handleLocationClick}
            />
            <CategorySlider
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
            <RestaurantGrid
              selectedCategory={selectedCategory}
              onRestaurantClick={handleRestaurantClick}
            />
            <footer className="bg-gray-900 text-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500 mb-4">Vizinhando</div>
                  <p className="text-gray-400">Comida deliciosa ao seu alcance</p>
                  <div className="mt-6 text-sm text-gray-500">
                    © 2024 Vizinhando Portugal. Todos os direitos reservados.
                  </div>
                </div>
              </div>
            </footer>
          </>
        );
    }
  };

  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path="/*" element={renderCurrentView()} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
};

export default App;