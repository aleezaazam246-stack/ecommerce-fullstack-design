export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  ratingCount: number;
  stock: number;
  features: string[];
  specifications: Record<string, string>;
  colors: string[];
  sizes?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export enum OrderStatus {
  PROCESSING = "Processing",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
}

export interface Order {
  id: string;
  items: CartItem[];
  date: string;
  total: number;
  status: OrderStatus;
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
