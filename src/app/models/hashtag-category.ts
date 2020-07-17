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
      if ((i <= 16 && (i % 4 === 0 || i % 4 === 3))
      || (i > 16 && (i % 5 === 0 || i % 5 === 3))) {
        this.tags[i].isCensored = true;
      }
    }
  }

}
