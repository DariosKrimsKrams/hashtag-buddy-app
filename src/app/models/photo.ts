import { HashtagCategory } from './hashtag-category';
import { SelectedHashtag } from './selected-hashtag';
import { ResultFeedback } from './result-feedback';

export class Photo {
	id: number;
	image: string;
	categories: HashtagCategory[];
	selectedHashtags: SelectedHashtag[];
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

}