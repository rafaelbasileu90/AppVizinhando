import React, { useState, useEffect } from "react";
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
import { restaurantService, categoryService } from './services/api';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [restaurantsData, categoriesData] = await Promise.all([
          restaurantService.getAll(),
          categoryService.getAll()
        ]);
        
        setRestaurants(restaurantsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados. Usando dados offline.",
          variant: "destructive"
        });
        
        // Fallback to mock data
        const { mockRestaurants, mockCategories } = await import('./data/mock');
        setRestaurants(mockRestaurants);
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [toast]);

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setCurrentView('restaurants');
    
    // Load restaurants for selected category
    try {
      const filteredRestaurants = await restaurantService.getAll(category.name);
      setRestaurants(filteredRestaurants || []);
    } catch (error) {
      console.error('Error loading restaurants by category:', error);
      toast({
        title: "Erro",
        description: "Erro ao filtrar restaurantes.",
        variant: "destructive"
      });
    }
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

  const handleBackToHome = async () => {
    setCurrentView('home');
    setSelectedCategory(null);
    setSelectedRestaurant(null);
    
    // Reload all restaurants
    try {
      const allRestaurants = await restaurantService.getAll();
      setRestaurants(allRestaurants || []);
    } catch (error) {
      console.error('Error reloading restaurants:', error);
    }
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

  const handleCheckout = async (orderData) => {
    try {
      // Format order data for API
      const formattedOrderData = {
        restaurantId: selectedRestaurant.id,
        items: orderData.items.map(item => ({
          menuItemId: item.id || "6507f1f130c72219b671f2a1", // Mock ID for now
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        deliveryAddress: {
          street: orderData.address.street,
          city: orderData.address.city,
          postalCode: orderData.address.postalCode
        },
        paymentMethod: orderData.payment.name,
        subtotal: orderData.totals.subtotal,
        deliveryFee: orderData.totals.deliveryFee,
        serviceFee: orderData.totals.serviceFee,
        total: orderData.totals.total
      };

      // For now, just simulate success without actual API call
      // await orderService.create(formattedOrderData);
      
      toast({
        title: "Pedido realizado!",
        description: "Seu pedido foi enviado para o restaurante.",
      });
      setCartItems([]);
      setCurrentView('home');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erro no pedido",
        description: "Não foi possível processar seu pedido. Tente novamente.",
        variant: "destructive"
      });
    }
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

  const handleSearchClick = async (searchTerm) => {
    if (!searchTerm?.trim()) return;
    
    try {
      const searchResults = await restaurantService.getAll(null, searchTerm);
      setRestaurants(searchResults || []);
      setCurrentView('restaurants');
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error searching restaurants:', error);
      toast({
        title: "Erro na busca",
        description: "Erro ao buscar restaurantes.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-red-600 flex items-center justify-center">
        <div className="text-white text-xl">Carregando Vizinhando...</div>
      </div>
    );
  }

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
              onSearch={handleSearchClick}
            />
            <RestaurantGrid
              selectedCategory={selectedCategory}
              restaurants={restaurants}
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
              onSearch={handleSearchClick}
            />
            <HeroSection
              onSearchClick={handleSearchClick}
              onLocationClick={handleLocationClick}
            />
            <CategorySlider
              categories={categories}
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
            <RestaurantGrid
              selectedCategory={selectedCategory}
              restaurants={restaurants}
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
      <div className="App min-h-screen bg-red-600 text-white">
        <Routes>
          <Route path="/*" element={renderCurrentView()} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
};

export default App;