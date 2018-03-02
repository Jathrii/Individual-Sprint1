import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

const productsURL = 'http://localhost:3000/api/product/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProductService {

  getProducts(): Observable<any> {
    return this.http.get<any>(productsURL + 'getProducts', httpOptions);
  }

  createProduct(product): Observable<any> {
    return this.http.post<any>(productsURL + 'createProduct', product, httpOptions);
  }

  updateProduct(product): Observable<any> {
    return this.http.patch<any>(productsURL + 'updateProduct/' + product._id, product, httpOptions);
  }

  deleteProduct(productId): Observable<any> {
    return this.http.delete<any>(productsURL + 'deleteProduct/' + productId, httpOptions);
  }

  constructor(private http: HttpClient) { }

}
