import { Hashtag } from "./hashtag";
import { HashtagCategory } from "./hashtag-category";

export class Photo {
	id: number;
	imageUrl?: string;
	categories?: HashtagCategory[];
	selected?: Hashtag[];
    timestamp?: string;
}