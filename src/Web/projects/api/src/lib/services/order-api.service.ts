import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AddCartItem, Cart, UpdateCartItem } from '../models/cart.model';
import { Order, OrderStatus, PaymentRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/api/orders/cart`);
  }

  addToCart(item: AddCartItem): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/api/orders/cart/items`, item);
  }

  updateCartItem(itemId: string, update: UpdateCartItem): Observable<Cart> {
    return this.http.put<Cart>(`${this.baseUrl}/api/orders/cart/items/${itemId}`, update);
  }

  removeCartItem(itemId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/api/orders/cart/items/${itemId}`);
  }

  applyCombo(): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/api/orders/cart/apply-combo`, {});
  }

  checkout(payment: PaymentRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/api/orders/checkout`, payment);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/api/orders/orders`);
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/api/orders/orders/${id}`);
  }

  getOrderStatus(id: string): Observable<OrderStatus> {
    return this.http.get<OrderStatus>(`${this.baseUrl}/api/orders/orders/${id}/status`);
  }
}
