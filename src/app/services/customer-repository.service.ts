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

  private CreateCustomerUrl = environment + "/Customer/Create";

  createCustomer(): Observable<string> {
    return this.http.post<string>(this.CreateCustomerUrl, undefined);
  }

}