import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { CustomerRepository } from "../services/customer-repository.service";
import { Observable, of } from 'rxjs';
 
export enum CustomerCreateStatus {
    None,
    AlreadyCreated,
    NewlyCreated,
    Failed
}

@Injectable({
    providedIn: "root"
})
export class CustomerService {

    private keyCustomerId: string = 'userId';

    constructor(
        private readonly localStorageService: LocalStorageService,
        private readonly customerRepositoryService: CustomerRepository
    ) { }

    public createUserIdIfNotExist(): Observable<CustomerCreateStatus> {
        return new Observable<CustomerCreateStatus>(observer => {
            if(this.localStorageService.has(this.keyCustomerId)) {
                observer.next(CustomerCreateStatus.AlreadyCreated);
                observer.complete();
                return;
            }
            this.customerRepositoryService.createCustomer().subscribe(result => {
                this.localStorageService.set(this.keyCustomerId, result.customerId);
                observer.next(CustomerCreateStatus.NewlyCreated);
                observer.complete();
            }, (error) => {
                observer.next(CustomerCreateStatus.Failed);
                observer.complete();
            });
        });
    }

    public getCustomerId(): string {
        return this.localStorageService.get(this.keyCustomerId);
    }

    public clearAll(): void {
        this.localStorageService.remove(this.keyCustomerId);
    }

}