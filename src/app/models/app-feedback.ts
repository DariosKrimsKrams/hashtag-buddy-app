export class AppFeedback {
  public customerId: string;
  public email: string;
  public message: string;

  public constructor(init?: Partial<AppFeedback>) {
    Object.assign(this, init);
  }
}
