// Mock data for Vizinhando - Portuguese Food Delivery App

export const mockRestaurants = [
  {
    id: 1,
    name: "Taberna Real",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    cuisine: "Portuguesa",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: 2.50,
    isOpen: true,
    promo: "Desconto de 20%",
    categories: ["Tradicional", "Grelhados"],
    description: "Autêntica cozinha portuguesa com pratos tradicionais"
  },
  {
    id: 2,
    name: "Pizza da Nonna",
    image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=400",
    cuisine: "Italiana",
    rating: 4.6,
    deliveryTime: "30-40 min",
    deliveryFee: 1.99,
    isOpen: true,
    promo: null,
    categories: ["Pizza", "Massa"],
    description: "Pizzas artesanais no forno a lenha"
  },
  {
    id: 3,
    name: "Sushi Zen",
    image: "https://images.pexels.com/photos/3023476/pexels-photo-3023476.jpeg?w=400",
    cuisine: "Japonesa",
    rating: 4.9,
    deliveryTime: "40-50 min",
    deliveryFee: 3.50,
    isOpen: true,
    promo: "Oferta: 2x1 em makis",
    categories: ["Sushi", "Asiática"],
    description: "Sushi fresco e sashimi premium"
  },
  {
    id: 4,
    name: "Burger House",
    image: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=400",
    cuisine: "Hambúrgueres",
    rating: 4.4,
    deliveryTime: "20-30 min",
    deliveryFee: 1.50,
    isOpen: false,
    promo: null,
    categories: ["Fast Food", "Hambúrgueres"],
    description: "Hambúrgueres gourmet com ingredientes frescos"
  },
  {
    id: 5,
    name: "Cantina do Bairro",
    image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=400",
    cuisine: "Portuguesa",
    rating: 4.7,
    deliveryTime: "35-45 min",
    deliveryFee: 2.00,
    isOpen: true,
    promo: "Entrega grátis",
    categories: ["Tradicional", "Caseira"],
    description: "Comida caseira portuguesa como a da avó"
  }
];

export const mockCategories = [
  { id: 1, name: "Promocões", icon: "🔥", color: "#ff6b6b" },
  { id: 2, name: "Portuguesa", icon: "🇵🇹", color: "#28c76f" },
  { id: 3, name: "Pizza", icon: "🍕", color: "#ff9f43" },
  { id: 4, name: "Sushi", icon: "🍣", color: "#17a2b8" },
  { id: 5, name: "Hambúrgueres", icon: "🍔", color: "#ffc107" },
  { id: 6, name: "Doces", icon: "🧁", color: "#e83e8c" },
  { id: 7, name: "Bebidas", icon: "🥤", color: "#6f42c1" },
  { id: 8, name: "Vegetariano", icon: "🥗", color: "#20c997" }
];

export const mockMenuItems = {
  1: [ // Taberna Real
    {
      id: 101,
      name: "Bacalhau à Brás",
      description: "Bacalhau desfiado com batata palha, ovos e azeitonas",
      price: 14.50,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300",
      category: "Pratos Principais"
    },
    {
      id: 102,
      name: "Francesinha",
      description: "Sanduíche tradicional do Porto com molho especial",
      price: 12.90,
      image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=300",
      category: "Pratos Principais"
    },
    {
      id: 103,
      name: "Pastéis de Nata",
      description: "Famosos pastéis de nata portugueses (6 unidades)",
      price: 7.50,
      image: "https://images.pexels.com/photos/3023476/pexels-photo-3023476.jpeg?w=300",
      category: "Sobremesas"
    }
  ]
};

export const mockUser = {
  id: 1,
  name: "Maria Silva",
  email: "maria@email.com",
  phone: "+351 912 345 678",
  addresses: [
    {
      id: 1,
      label: "Casa",
      street: "Rua das Flores, 123",
      city: "Lisboa",
      postalCode: "1200-192",
      isDefault: true
    },
    {
      id: 2,
      label: "Trabalho",
      street: "Avenida da Liberdade, 456",
      city: "Lisboa",
      postalCode: "1250-145",
      isDefault: false
    }
  ]
};

export const mockOrders = [
  {
    id: "VZ001",
    restaurantName: "Taberna Real",
    items: ["Bacalhau à Brás", "Pastéis de Nata"],
    total: 22.00,
    status: "delivered",
    date: "2024-01-15T18:30:00Z",
    deliveryTime: "25 min"
  },
  {
    id: "VZ002",
    restaurantName: "Pizza da Nonna",
    items: ["Pizza Margherita", "Tiramisu"],
    total: 18.50,
    status: "preparing",
    date: "2024-01-16T19:15:00Z",
    deliveryTime: "35 min"
  }
];

export const paymentMethods = [
  { id: 1, name: "MBWay", icon: "💳", type: "mbway" },
  { id: 2, name: "Cartão de Crédito", icon: "💳", type: "credit_card" },
  { id: 3, name: "Multibanco", icon: "🏧", type: "multibanco" },
  { id: 4, name: "Dinheiro", icon: "💶", type: "cash" }
];