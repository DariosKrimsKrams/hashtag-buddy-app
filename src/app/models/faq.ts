export class Faq {
  public id: number;
  public expand: boolean;
  public title?: string;
  public content?: string;

  public constructor(init?: Partial<Faq>) {
    Object.assign(this, init);
  }
}
