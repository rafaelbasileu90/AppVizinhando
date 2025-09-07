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
    <section className="py-8 bg-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Categorias</h2>
          <div className="hidden sm:flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="h-8 w-8 border-white text-white hover:bg-white hover:text-red-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="h-8 w-8 border-white text-white hover:bg-white hover:text-red-600"
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
                  ? 'border-white bg-red-500 shadow-md'
                  : 'border-red-400 bg-red-500 hover:border-white hover:bg-red-400'
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
                  ? 'text-white'
                  : 'text-white'
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