import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Filter, SlidersHorizontal } from 'lucide-react';
import RestaurantCard from './RestaurantCard';

const RestaurantGrid = ({ selectedCategory, restaurants = [], onRestaurantClick }) => {
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort restaurants
  const filteredRestaurants = useMemo(() => {
    let filtered = [...restaurants];

    // Sort restaurants
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'deliveryTime':
        filtered.sort((a, b) => {
          const timeA = parseInt(a.deliveryTime.split('-')[0]);
          const timeB = parseInt(b.deliveryTime.split('-')[0]);
          return timeA - timeB;
        });
        break;
      case 'deliveryFee':
        filtered.sort((a, b) => a.deliveryFee - b.deliveryFee);
        break;
      default:
        // Default relevance order
        break;
    }

    return filtered;
  }, [restaurants, sortBy]);

  if (!restaurants) {
    return (
      <section className="py-8 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Carregando restaurantes...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory ? selectedCategory.name : 'Todos os restaurantes'}
            </h2>
            <p className="text-red-100 mt-1">
              {filteredRestaurants.length} restaurantes encontrados
            </p>
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white text-gray-900">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="rating">Melhor avaliação</SelectItem>
                <SelectItem value="deliveryTime">Tempo de entrega</SelectItem>
                <SelectItem value="deliveryFee">Taxa de entrega</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 border-white text-white hover:bg-white hover:text-red-600"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4">Filtrar por:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo de entrega
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer tempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-30">Até 30 min</SelectItem>
                    <SelectItem value="30-45">30-45 min</SelectItem>
                    <SelectItem value="45+">Mais de 45 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taxa de entrega
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer taxa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Entrega grátis</SelectItem>
                    <SelectItem value="0-2">Até €2</SelectItem>
                    <SelectItem value="2+">Mais de €2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer nota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4.5+">4.5+ estrelas</SelectItem>
                    <SelectItem value="4.0+">4.0+ estrelas</SelectItem>
                    <SelectItem value="3.5+">3.5+ estrelas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promoções
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promo">Apenas com promoção</SelectItem>
                    <SelectItem value="no-promo">Sem promoção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id || restaurant._id}
              restaurant={restaurant}
              onClick={onRestaurantClick}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Nenhum restaurante encontrado
            </h3>
            <p className="text-red-100">
              Tente ajustar os filtros ou buscar por outra categoria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantGrid;