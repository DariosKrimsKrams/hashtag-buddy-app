import { Product } from "nativescript-purchase/product";

export class Plan {
    
	id: string;
	image: string;
	title?: string;
    amount: number;
    product?: Product;
    discount?: number;
    pricePerPhoto?: number;

    public constructor(init?: Partial<Plan>) {
      Object.assign(this, init);
    }

}