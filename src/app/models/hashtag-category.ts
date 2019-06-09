import { Hashtag } from "./hashtag";
import { HashtagResult } from "./hashtag-result";

export class HashtagCategory {
	public id: number;
	public title?: string;
	public tags?: Hashtag[];

	public static fromHashtagResult(hashtags: HashtagResult[], title: string): HashtagCategory {
	  var category = new HashtagCategory();
	  category.title = title;
	  category.tags = [];
	  for(let i = 0; i < hashtags.length; i++) {
		var hashtag = new Hashtag({title: hashtags[i].name});
		category.tags.push(hashtag);
	  }
	  return category;
	}
}