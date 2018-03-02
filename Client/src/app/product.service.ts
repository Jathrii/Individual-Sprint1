import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

const productsURL = 'http://localhost:3000/api/product/getProducts';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProductService {

  getProducts(): Observable<any> {
    return this.http.get<any>(productsURL, httpOptions);
  }

  constructor(private http: HttpClient) { }

}
