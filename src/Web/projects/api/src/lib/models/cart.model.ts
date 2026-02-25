export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  customization: string | null;
}

export interface AddCartItem {
  productId: string;
  quantity: number;
}

export interface UpdateCartItem {
  quantity: number;
}
