import { Hashtag } from "./hashtag";
import { HashtagCategory } from "./hashtag-category";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";

export class Photo {
	id: number;
	imageUrl?: string;
	categories?: HashtagCategory[];
	selected?: Hashtag[];
    date?: string;
    time?: string;
	image?: string;
	
	public getHashtags(): any[] {
		return ["ad", "asdasd"];
		// return this.categories[0].tags;
	}
}