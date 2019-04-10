import { HashtagCategory } from "./hashtag-category";
import { SelectedHashtag } from "./selected-hashtag";

export class Photo {
	id: number;
	image: string;
	categories: HashtagCategory[];
	selectedHashtags: SelectedHashtag[];
	timestamp: number;

	public constructor() {
		this.categories = [];
		this.selectedHashtags = [];
	}

}