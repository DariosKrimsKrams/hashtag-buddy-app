import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { PLAN } from "~/app/pages/data/plans";
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import *  as purchase from "nativescript-purchase";
import { Product } from "nativescript-purchase/product";
import { Transaction, TransactionState } from "nativescript-purchase/transaction";
import * as applicationSettings from "tns-core-modules/application-settings";
import { Plan } from '~/app/models/plan';
import * as Toast from 'nativescript-toast';
import { localize } from 'nativescript-localize/angular';

@Component({
  selector: 'ns-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  moduleId: module.id,
})
export class StoreComponent implements OnInit {

  openmenu = false;
  plans: Plan[] = PLAN;
  
  constructor(
    private page: Page, 
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    console.log("ngOnInit")
    var products = [
      "small",
      "medium",
      "large",
      "unlimited1month",
      "unlimited3months",
    ];

    (global as any).purchaseInitPromise = purchase.init(products);

    console.log((global as any).purchaseInitPromise);

    
    (global as any).purchaseInitPromise.then(() => {
      purchase.getProducts().then((products: Array<Product>) => {
        // console.log(products);
        products.forEach((product: Product) => {
          var plan = this.plans.filter(x => x.id == product.productIdentifier)[0];
          if(plan !== undefined) {
            plan.product = product;
          } else {
            plan = new Plan({
              id: product.productIdentifier,
              image: "~/app/assets/images/0.png",
              product: product,
            });
            this.plans.push(plan);
          }
          plan.title = product.localizedTitle.split(' (')[0];
        });
        this.calcDiscount();
      }).catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(err);
    });;

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

  private calcDiscount(): void {
    var cheapestInApp: Plan;
    var cheapestSubs: Plan;
    this.plans.map(x => {
      if(x.product === undefined) {
        return;
      }
      x.desc = x.product.localizedDescription;
      if(x.product.productType == "inapp" && (cheapestInApp == undefined || x.product.priceAmount < cheapestInApp.product.priceAmount)) {
        cheapestInApp = x;
      } else if(x.product.productType == "subs" && (cheapestSubs == undefined || x.product.priceAmount * x.amount < cheapestSubs.product.priceAmount)) {
        cheapestSubs = x;
      }
    })
    cheapestInApp.pricePerPhoto = cheapestInApp.product.priceAmount / cheapestInApp.amount; 
    cheapestSubs.pricePerPhoto = cheapestSubs.product.priceAmount / cheapestSubs.amount; 
    this.plans.forEach(x => {
      if(x.product === undefined) {
        return;
      }
      if(x.product.productType == "inapp" && x.id != cheapestInApp.id) {
        x.pricePerPhoto = x.product.priceAmount / x.amount;
        var discount = (1 - (x.pricePerPhoto / cheapestInApp.pricePerPhoto)) * 100;
        x.discount = Math.round(discount);
      } else if(x.product.productType == "subs" && x.id != cheapestSubs.id) {
        x.pricePerPhoto = x.product.priceAmount;
        var discount = (1 - (x.pricePerPhoto / cheapestSubs.pricePerPhoto)) * 100;
        x.discount = Math.round(discount);
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

  buyProduct(plan: Plan) {
    var product = plan.product;
    if (purchase.canMakePayments()) {
      purchase.buyProduct(product);
    } else {
      Toast.makeText(localize('store_buy_failed')).show();
    }
  }

  restore() {
    purchase.restorePurchases();
    Toast.makeText(localize('store_restored_successful')).show();
  }

}
