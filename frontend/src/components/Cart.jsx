import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin, 
  CreditCard,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { paymentMethods, mockUser } from '../data/mock';

const Cart = ({ cartItems, onBack, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const [selectedAddress, setSelectedAddress] = useState(mockUser.addresses[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [deliveryTime, setDeliveryTime] = useState('standard');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.50;
  const serviceFee = 1.00;
  const total = subtotal + deliveryFee + serviceFee;

  const deliveryOptions = [
    { value: 'standard', label: 'Padrão (30-40 min)', price: 0 },
    { value: 'express', label: 'Expresso (15-25 min)', price: 2.50 },
    { value: 'scheduled', label: 'Agendado', price: 0 }
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h2>
          <p className="text-gray-600 mb-6">Adicione alguns pratos deliciosos!</p>
          <Button onClick={onBack} className="bg-red-600 hover:bg-red-700">
            Explorar Restaurantes
          </Button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-lg font-semibold">Carrinho ({cartItems.length})</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seus itens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="text-lg font-semibold text-gray-900 mt-2">
                        €{item.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onRemoveItem(index)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Tempo de entrega</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deliveryOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="deliveryTime"
                          value={option.value}
                          checked={deliveryTime === option.value}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          className="text-red-600"
                        />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      {option.price > 0 && (
                        <span className="text-sm text-gray-600">
                          +€{option.price.toFixed(2)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Entrega</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedAddress.id.toString()} onValueChange={(value) => {
                  const address = mockUser.addresses.find(addr => addr.id.toString() === value);
                  setSelectedAddress(address);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUser.addresses.map((address) => (
                      <SelectItem key={address.id} value={address.id.toString()}>
                        <div>
                          <div className="font-medium">{address.label}</div>
                          <div className="text-sm text-gray-600">
                            {address.street}, {address.city}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Pagamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment.id === method.id}
                          onChange={() => setSelectedPayment(method)}
                          className="text-red-600"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                      </div>
                      {method.type === 'mbway' && (
                        <Badge className="bg-green-100 text-green-800">
                          Recomendado
                        </Badge>
                      )}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span>€{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de serviço</span>
                  <span>€{serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button
              onClick={() => onCheckout({
                items: cartItems,
                address: selectedAddress,
                payment: selectedPayment,
                deliveryTime,
                totals: { subtotal, deliveryFee, serviceFee, total }
              })}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
            >
              Finalizar Pedido - €{total.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;