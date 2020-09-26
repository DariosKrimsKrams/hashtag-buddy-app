import { Injectable } from '@angular/core';
import { Http } from '@nativescript/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class CustomerRepository {

  private createCustomerUrl = environment.apiUrl + '/Customer/Create';

  constructor(
  ) { }

  public createCustomer(): Observable<any> {
    return new Observable<any>(observer => {
      Http.request({
        url: this.createCustomerUrl,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        content: ''
      }).then((response) => {
        const result = response.content.toJSON();
        observer.next(result);
        observer.complete();
      }, (error) => {
        console.error('error createCustomer: ' + error);
        observer.error(error);
        observer.complete();
      });
    });
  }

}