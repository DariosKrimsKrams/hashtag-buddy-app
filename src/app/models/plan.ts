import { Product } from 'nativescript-purchase/product';

export class Plan {

  public id: string;
  public title: string;
  public desc: string;
  public desc2: string;
  public desc3: string;
  public amount: number;
  public tipstrick: boolean;
  public hashtagInspector: boolean;
  public category: number;

  public product?: Product;
  public discount?: string;
  public pricePerPhoto?: number;
  public priceFallback: string;
  public priceShort: string;

  public constructor(init?: Partial<Plan>) {
    Object.assign(this, init);
  }

}