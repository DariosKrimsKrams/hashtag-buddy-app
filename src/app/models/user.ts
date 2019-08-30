import { AppFeedback } from './app-feedback';
import { ResultFeedback } from './result-feedback';
import { Photo } from './photo';
import { Purchase } from './purchase';

export class User {

    public userId: string;
    public photos: Photo[];
    public appFeedbacks: AppFeedback[];
    public resultFeedbacks: ResultFeedback[];
    public purchases: Purchase[];

    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
      }
}