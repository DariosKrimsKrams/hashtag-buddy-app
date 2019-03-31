import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { getJSON } from "tns-core-modules/http";

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

@Injectable({
  providedIn: 'root',
})

export class CustomerRepositoryService {

  constructor(
    // private http: HttpClient,
  ) { }

  private createCustomerUrl = environment.apiUrl + "/Customer/Create";

  public createCustomer(): Observable<string> {
    const observable = new Observable<string>(observer => {
      getJSON(this.createCustomerUrl).then((result: any) => {
        console.log("result", result);
        observer.next(result);
        observer.complete();
      }, (e) => {
        console.log("error", e);
      });
    });
    return observable;
    // return this.http.post<any>(this.createCustomerUrl, null);
  }

}