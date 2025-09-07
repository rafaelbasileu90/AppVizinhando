import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, MapPin, Clock, Truck } from 'lucide-react';

const HeroSection = ({ onSearchClick, onLocationClick }) => {
  return (
    <section className="relative bg-gradient-to-br from-red-700 to-red-500 py-16 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Comida deliciosa
                <span className="text-red-200 block">ao seu alcance</span>
              </h1>
              <p className="text-xl text-red-100 leading-relaxed">
                Descubra os melhores restaurantes do seu bairro e receba suas refeições favoritas em minutos.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600 border-r border-gray-200 pr-4">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium">Lisboa</span>
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar restaurantes ou pratos..."
                    className="pl-10 border-0 focus:ring-0 text-gray-700"
                  />
                </div>
                <Button 
                  onClick={onSearchClick}
                  className="bg-red-600 hover:bg-red-700 text-white px-8"
                >
                  Buscar
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-800 rounded-full mx-auto mb-2">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-red-200">Restaurantes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-800 rounded-full mx-auto mb-2">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">30min</div>
                <div className="text-sm text-red-200">Entrega média</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-800 rounded-full mx-auto mb-2">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">15</div>
                <div className="text-sm text-red-200">Cidades</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=600&h=600&fit=crop"
                alt="Entregador Vizinhando"
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Entrega rápida</div>
                    <div className="text-sm text-gray-600">Média de 30 minutos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-800 rounded-full opacity-20"></div>
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-red-900 rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;