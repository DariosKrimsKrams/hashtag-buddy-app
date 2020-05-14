import { HashtagCategory } from './hashtag-category';
import { ResultFeedback } from './result-feedback';
import { Hashtag } from './hashtag';

export class Photo {
  public id: number;
  public image: string;
  public categories: HashtagCategory[];
  public selectedHashtags: Hashtag[];
  public feedback: ResultFeedback;
  public timestamp: number;
  public logId: number;
  public proMode: boolean;

  public constructor() {
    this.categories = [];
    this.selectedHashtags = [];
  }

  public censorHashtags(): void {
    if (this.proMode) {
      return;
    }
    for (let i = 0; i < this.categories.length; i++) {
      this.categories[i].censorHashtags();
    }
  }

  public static isHashtagPartOfAnyCategory(photo: Photo, title: string): boolean {
    for (let i = 0; i < photo.categories.length; i++) {
     const category = photo.categories[i];
     for (let j = 0; j < category.tags.length; j++) {
      const tag = category.tags[j];
        if (tag.title.toLowerCase() === title.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

}
