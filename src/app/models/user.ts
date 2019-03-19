import { AppFeedback } from "./app-feedback";
import { ResultFeedback } from "./result-feedback";
import { Photo } from "./photo";
import { Purchase } from "./purchase";

export class User {

    userId: string;
    photos: Photo[];
    appFeedbacks: AppFeedback[];
    resultFeedbacks: ResultFeedback[];
    purchases: Purchase[];
    
    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
      }
}