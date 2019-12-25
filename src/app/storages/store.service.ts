import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  @Output() public onBuyProduct: EventEmitter<string> = new EventEmitter<string>();
  @Output() public onPurchaseSuccessful: EventEmitter<string> = new EventEmitter<string>();


}