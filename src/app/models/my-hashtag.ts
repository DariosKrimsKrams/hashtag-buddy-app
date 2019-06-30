import { Hashtag } from "./hashtag";

export class MyHashtag extends Hashtag {
    count: number;

    public constructor(title: string, count: number) {
        super(title);
        this.count = count;
    }

}