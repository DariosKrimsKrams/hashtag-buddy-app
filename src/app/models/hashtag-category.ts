import { Hashtag } from './hashtag';
import { HashtagResult } from './hashtag-result';

export class HashtagCategory {
  public id: number;
  public title?: string;
  public tags?: Hashtag[];

  public constructor() {
    this.tags = [];
  }

  public static fromHashtagResult(hashtags: HashtagResult[], title: string): HashtagCategory {
    const category = new HashtagCategory();
    category.title = title;
    category.tags = [];
    for (let i = 0; i < hashtags.length; i++) {
      const hashtag = new Hashtag(hashtags[i].name);
      category.tags.push(hashtag);
    }
    return category;
  }

  public censorHashtags(): void {
    for (let i = 0; i < this.tags.length; i++) {
      if (i < 10 && i * 2 < this.tags.length - 1) {
        this.tags[i].isCensored = true;
      }
    }
  }

}
