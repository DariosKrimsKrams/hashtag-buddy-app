import { Product } from 'nativescript-purchase/product';

export class Plan {

  public id: string;
  public image: string;
  public title: string;
  public desc: string;
  public desc2?: string;
  public type: string;
  public amount: number;
  public tipstrick: boolean;

  public product?: Product;
  public discount?: number;
  public pricePerPhoto?: number;
  public priceFallback: string;

  public constructor(init?: Partial<Plan>) {
    Object.assign(this, init);
  }

}