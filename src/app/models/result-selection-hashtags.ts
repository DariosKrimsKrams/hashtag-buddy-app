import { ResultSelectionHashtag } from "./result-selection-hashtag";
import { SelectedHashtag } from "./selected-hashtag";
import { Photo } from "./photo";
import { Hashtag } from "./hashtag";
import { HashtagCategory } from "./hashtag-category";

export class ResultSelectionHashtags {
  
  hashtags: ResultSelectionHashtag[];

  public constructor() {
    this.hashtags = [];
  }

  public get length(): number {
    return this.hashtags.length || 0;
  }

  public splice(start: number, deleteCount: number): void {
    this.hashtags.splice(start, deleteCount);
  }

  public push(hashtag: ResultSelectionHashtag): void {
    this.hashtags.push(hashtag);
  }

  public toSelectedHashtags(): SelectedHashtag[] {
    var selectedHashtags = [];
    for(var i = 0; i < this.hashtags.length; i++) {
      var hashtag = this.hashtags[i];
      var tag = new SelectedHashtag({title: hashtag.hashtag.title, categoryId: hashtag.titleId});
      selectedHashtags.push(tag);
    }
    return selectedHashtags;
  }

  public fromPhoto(photo: Photo): void {
    this.hashtags = this.fromSelectedHashtags(photo.selectedHashtags || []);
    this.addTagIds(photo.categories, this.hashtags);  
  }

  private fromSelectedHashtags(hashtags: SelectedHashtag[]): ResultSelectionHashtag[] {
    var result: ResultSelectionHashtag[] = []
    for(var i = 0; i < hashtags.length; i++) {
      var hashtag = hashtags[i];
      var resultSelectionHashtag = new ResultSelectionHashtag({hashtag: new Hashtag({title: hashtag.title}), titleId: hashtag.categoryId, tagId: -1});
      result.push(resultSelectionHashtag);
    }
    return result;
  }

  private addTagIds(categories: HashtagCategory[], hashtags: ResultSelectionHashtag[]) {
    for(var i = 0; i < hashtags.length; i++) {
      var hashtag = hashtags[i];
      if(hashtag.titleId == -1) {
        continue;
      }
      var category = categories[hashtag.titleId];
      for(var j = 0; j < category.tags.length; j++) {
        var categoryTag = category.tags[j];
        if(categoryTag.title == hashtag.hashtag.title) {
          hashtag.tagId = j;
          break;
        }
      }
    }
  }

}