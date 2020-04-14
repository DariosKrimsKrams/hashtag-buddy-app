import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  @Output() public onBuyProduct: EventEmitter<string> = new EventEmitter<string>();
  @Output() public onRestorePurchases: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onPurchasedSuccessful: EventEmitter<string> = new EventEmitter<string>();


}