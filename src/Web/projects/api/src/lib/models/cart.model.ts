export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  comboDiscount: number;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface AddCartItem {
  productId: string;
  quantity: number;
}

export interface UpdateCartItem {
  quantity: number;
}
