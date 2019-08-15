import { HashtagCategory } from './hashtag-category';
import { ResultFeedback } from './result-feedback';
import { Hashtag } from './hashtag';

export class Photo {
  id: number;
  image: string;
  categories: HashtagCategory[];
  selectedHashtags: Hashtag[];
  feedback: ResultFeedback;
  timestamp: number;
  logId: number;
  proMode: boolean;

  public constructor() {
    this.categories = [];
    this.selectedHashtags = [];
  }

  public censorHashtags(): void {
    if (this.proMode) {
      return;
    }
    for (let i = 0; i < this.categories.length; i++) {
      let category = this.categories[i];
      for (let j = 0; j < category.tags.length; j++) {
        let hashtag = category.tags[j];
        if (j < 10 && j * 2 < category.tags.length) {
          hashtag.isCensored = true;
        }
      }
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
