import { Hashtag } from "./hashtag";

export class SelectedHashtag {
	name: Hashtag;
	titleId: number;
	tagId: number;

    public constructor(init?: Partial<SelectedHashtag>) {
      Object.assign(this, init);
    }
}