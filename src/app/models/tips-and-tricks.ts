export class TipsAndTricks {
  public id: number;
  public expand: boolean;
  public title?: string;
  public content?: string;
  public locked?: boolean;

  public constructor(init?: Partial<TipsAndTricks>) {
    Object.assign(this, init);
  }
}
