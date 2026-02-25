import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Category, ComboOffer, Product, SeasonalDrop } from '../models';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/api/catalog/products`);
  }

  getProduct(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/api/catalog/products/by-slug/${slug}`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/api/catalog/products/featured`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/api/catalog/categories`);
  }

  getProductsByCategory(slug: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/api/catalog/categories/${slug}/products`);
  }

  getCombos(): Observable<ComboOffer[]> {
    return this.http.get<ComboOffer[]>(`${this.baseUrl}/api/catalog/combos`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/api/catalog/products`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/api/catalog/products/${id}`, product);
  }

  getSeasonalDrops(): Observable<SeasonalDrop[]> {
    return this.http.get<SeasonalDrop[]>(`${this.baseUrl}/api/catalog/seasonal-drops`);
  }
}
