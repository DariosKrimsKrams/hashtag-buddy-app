import { Rating } from '../rating';

export class ResultFeedbackRequest {
  public customerId: string;
  public photoId: number;
  public rating: Rating;
  public goodHashtags: string[];
  public badHashtags: string[];
  public missingHashtags: string;
  public comment: string;

  public constructor(init?: Partial<ResultFeedbackRequest>) {
    Object.assign(this, init);
  }

}