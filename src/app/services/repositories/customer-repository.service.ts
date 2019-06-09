import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { request } from "tns-core-modules/http";

@Injectable({
  providedIn: 'root',
})

export class CustomerRepository {

  private createCustomerUrl = environment.apiUrl + "/Customer/Create";

  constructor(
  ) { }

  public createCustomer(): Observable<any> {
    return new Observable<any>(observer => {
      request({
        url: this.createCustomerUrl,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: ''
      }).then((response) => {
          const result = response.content.toJSON();
          observer.next(result);
          observer.complete();
      }, (error) => {
        console.log("error", error);
        observer.error(error);
        observer.complete();
      });
    });
  }

}