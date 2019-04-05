import { Hashtag } from "./hashtag";
import { HashtagCategory } from "./hashtag-category";

export class Photo {
	id: number;
	image: string;
	categories?: HashtagCategory[];
	selectedHashtags?: Hashtag[];
    timestamp?: number;

}