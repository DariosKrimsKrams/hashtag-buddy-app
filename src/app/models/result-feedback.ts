import { Rating } from './rating';

export class ResultFeedback {
  rating: Rating;
  goodHashtags: string[];
  badHashtags: string[];
  missingHashtags: string;
  comment: string;

  public constructor(init?: Partial<ResultFeedback>) {
    Object.assign(this, init);
  }
  
}