export class ResultFeedbackRequest {
  customerId: string;
  logId: number;
  rating: string;
  goodHashtags: string[];
  badHashtags: string[];
  missingHashtags: string;
  comment: string;
}