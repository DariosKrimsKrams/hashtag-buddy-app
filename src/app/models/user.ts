import { AppFeedback } from "./app-feedback";
import { ResultFeedback } from "./result-feedback";
import { Photo } from "./photo";

export class User {

	userId: string;
	photos: Photo[];
	appFeedbacks: AppFeedback[];
	resultFeedbacks: ResultFeedback[];
    // purchases: Plan
    
    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
      }
}