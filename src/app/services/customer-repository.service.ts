import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class CustomerRepositoryService {

  constructor(
    private http: HttpClient,
  ) { }

  private createCustomerUrl = environment.apiUrl + "/Customer/Create";

  createCustomer(): Observable<any> {
    return this.http.post<any>(this.createCustomerUrl, null);
  }

}