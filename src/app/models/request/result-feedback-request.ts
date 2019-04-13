export class ResultFeedbackRequest {
  customerId: string;
  photoId: number;
  rating: string;
  goodHashtags: string[];
  badHashtags: string[];
  missingHashtags: string;
  comment: string;

  public constructor(init?: Partial<ResultFeedbackRequest>) {
    Object.assign(this, init);
  }

}