import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { PLAN } from "~/app/pages/data/plans";
import * as app from "application";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import *  as purchase from "nativescript-purchase";
import { Product } from "nativescript-purchase/product";
import { Transaction, TransactionState } from "nativescript-purchase/transaction";
import * as applicationSettings from "application-settings";

@Component({
  selector: 'ns-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  moduleId: module.id,
})
export class StoreComponent implements OnInit {

  openmenu = false;
  plans = PLAN;
  
  constructor(
    private page: Page, 
    private router: RouterExtensions
    ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    var products = [
      "com.sample.purchase.coolproduct1",
      "com.sample.purchase.coolproduct2"
    ];

    (global as any).purchaseInitPromise = purchase.init(products);

    purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
      if (transaction.transactionState === TransactionState.Purchased) {
          alert(`Congratulations you just bought ${transaction.productIdentifier}!`);
          console.log(transaction.transactionDate);
          console.log(transaction.transactionIdentifier);
          applicationSettings.setBoolean(transaction.productIdentifier, true);
      }
      else if (transaction.transactionState === TransactionState.Restored) {
          console.log(`Purchase of ${transaction.productIdentifier} restored.`);
          console.log(transaction.transactionDate);
          console.log(transaction.transactionIdentifier);
          console.log(transaction.originalTransaction.transactionDate);
          applicationSettings.setBoolean(transaction.productIdentifier, true);
      }
      else if (transaction.transactionState === TransactionState.Failed) {
          alert(`Purchase of ${transaction.productIdentifier} failed!`);
      }    
    });
  }

  openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeMenu() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  getProducts() {
    (global as any).purchaseInitPromise.then(() => {
      purchase.getProducts().then((products: Array<Product>) => {
          products.forEach((product: Product) => {
              console.log(product.productIdentifier);
              console.log(product.localizedTitle);
              console.log(product.priceFormatted);
          });
      });
    });
  }

  buyProduct(product: Product) {
    if (purchase.canMakePayments()) {
      purchase.buyProduct(product);
    }
    else {
        alert("Sorry, your account is not eligible to make payments!");
    }
  }

  restore() {
    purchase.restorePurchases();
  }

}
