import React, { useRef } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockCategories } from '../data/mock';

const CategorySlider = ({ onCategorySelect, selectedCategory }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
          <div className="hidden sm:flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {mockCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category)}
              className={`flex-shrink-0 flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md min-w-[100px] ${
                selectedCategory?.id === category.id
                  ? 'border-red-500 bg-red-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <span style={{ color: category.color }}>
                  {category.icon}
                </span>
              </div>
              <span className={`text-sm font-medium text-center ${
                selectedCategory?.id === category.id
                  ? 'text-red-600'
                  : 'text-gray-700'
              }`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;