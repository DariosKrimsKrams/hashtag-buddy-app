import { Rating } from './rating';

export class ResultFeedback {
  public rating: Rating;
  public goodHashtags: string[];
  public badHashtags: string[];
  public missingHashtags: string;
  public comment: string;

  public constructor(init?: Partial<ResultFeedback>) {
    Object.assign(this, init);
  }

}