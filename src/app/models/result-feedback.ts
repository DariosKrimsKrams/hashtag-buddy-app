export class ResultFeedback {
  rating: number;
  goodHashtags: any[];
  badHashtags: any[];
  missingHashtags: string;
  comment: string;

  public constructor(init?: Partial<ResultFeedback>) {
    Object.assign(this, init);
  }
  
}