import { Product } from 'nativescript-purchase/product';

export class Plan {
    
  id: string;
  image: string;
  title: string;
  desc: string;
  desc2?: string;
  type: string;

  amount: number;
  product?: Product;
  discount?: number;
  pricePerPhoto?: number;
  priceFallback: string;

  public constructor(init?: Partial<Plan>) {
    Object.assign(this, init);
  }

}