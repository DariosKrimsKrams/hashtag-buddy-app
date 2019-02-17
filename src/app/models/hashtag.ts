export class Hashtag {
    title: string;

    public constructor(init?: Partial<Hashtag>) {
      Object.assign(this, init);
    }

}