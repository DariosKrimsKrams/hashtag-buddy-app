import { Hashtag } from "./hashtag";
import { HashtagCategory } from "./hashtag-category";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";

export class Photo {
	id: number;
	image: string;
	categories?: HashtagCategory[];
	selectedHashtags?: Hashtag[];
    // date?: string;
    // time?: string;
    timestamp?: number;
	
	public getHashtags(): any[] {
		return ["ad", "asdasd"];
		// return this.categories[0].tags;
	}
}