export class Faq {
  id: number;
  expand: boolean;
  title?: string;
  content?: string;

  public constructor(init?: Partial<Faq>) {
    Object.assign(this, init);
  }
}
