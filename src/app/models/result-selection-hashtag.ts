import { Hashtag } from './hashtag';

export class ResultSelectionHashtag {
	hashtag: Hashtag;
	titleId: number;
	tagId: number;

  public constructor(init?: Partial<ResultSelectionHashtag>) {
    Object.assign(this, init);
  }
}