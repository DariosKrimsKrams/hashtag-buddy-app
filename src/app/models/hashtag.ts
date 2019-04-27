export class Hashtag {
    title: string;
    isCensored: boolean;

    public constructor(init?: Partial<Hashtag>) {
      Object.assign(this, init);
    }

}