import { ResultSelectionHashtag } from "./result-selection-hashtag";
import { SelectedHashtag } from "./selected-hashtag";
import { Photo } from "./photo";

export class ResultSelectionHashtags {
  hashtags: ResultSelectionHashtag[];

  public constructor() {
    this.hashtags = [];
  }

  public get length(): number {
    return this.hashtags.length || 0;
  }

  public splice(start, deleteCount): void {
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
    this.fromSelectedHashtags(photo.selectedHashtags || []);

    // find tagId
    for(var i = 0; i < this.hashtags.length; i++) {
        var hashtag = this.hashtags[i];
        if(hashtag.titleId == -1) {
            // ToDo funzt das?
            continue;
        }
        var category = photo.categories[hashtag.titleId];
        for(var j = 0; j < category.tags.length; j++) {
            var categoryTag = category.tags[j];
            if(categoryTag.title == hashtag.hashtag.title) {
                hashtag.tagId = j;
                // ToDo funzt auch das?
                break;
            }
        }
    }

  }
  public fromSelectedHashtags(hashtags: SelectedHashtag[]): void {
    for(var i = 0; i < this.hashtags.length; i++) {
        var hashtag = hashtags[i];
        // ToDo bei titleId = -1 -> tagId hochzählen
        var resultSelectionHashtag = new ResultSelectionHashtag({hashtag: hashtag, titleId: hashtag.categoryId, tagId: 0});
        this.hashtags.push(resultSelectionHashtag);
    }
  }

}