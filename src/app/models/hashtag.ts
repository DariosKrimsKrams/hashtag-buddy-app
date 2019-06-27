export class Hashtag {
  public title: string;
  public isCensored: boolean;

  // public constructor(init?: Partial<Hashtag>) {
  //   Object.assign(this, init);
  // }

  public constructor(title: string) {
    this.title = title;
  }

}