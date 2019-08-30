import { Hashtag } from './hashtag';

export class MyHashtag extends Hashtag {
  public count: number;
  public category: string;

  public constructor(title: string, count: number, category: string = '') {
    super(title);
    this.count = count;
    this.category = category;
  }
}
