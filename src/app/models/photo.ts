import { HashtagCategory } from "./hashtag-category";
import { SelectedHashtag } from "./selected-hashtag";
import { ResultFeedback } from "./result-feedback";

export class Photo {
	id: number;
	image: string;
	categories: HashtagCategory[];
	selectedHashtags: SelectedHashtag[];
	feedback: ResultFeedback;
	timestamp: number;

	public constructor() {
		this.categories = [];
		this.selectedHashtags = [];
	}

}