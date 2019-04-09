import { Hashtag } from "./hashtag";

export class SelectedHashtag extends Hashtag {
    // title: string;
    categoryId: number;

    public constructor(init?: Partial<SelectedHashtag>) {
        super(init);
        Object.assign(this, init);
    }

}