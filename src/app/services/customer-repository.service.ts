import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { getJSON, getString, request } from "tns-core-modules/http";

@Injectable({
  providedIn: 'root',
})

export class CustomerRepositoryService {

  constructor(
  ) { }

  private createCustomerUrl = environment.apiUrl + "/Customer/Create";

  public createCustomer(): Observable<any> {
    const observable = new Observable<any>(observer => {
      request({
        url: this.createCustomerUrl,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: ''
      }).then((response) => {
          const result = response.content.toJSON();
          observer.next(result);
          observer.complete();
      }, (e) => {
        console.log("error", e);
      });
    });
    return observable;
  }

}