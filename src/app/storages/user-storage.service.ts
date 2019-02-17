import { Injectable } from "@angular/core";
import { HASHTAGS } from "~/app/home/mock-data/hashtags";
import { HashtagCategory } from "~/app/models/hashtag-category";
import { Hashtag } from "~/app/models/hashtag";

@Injectable({
    providedIn: "root"
})
export class UserStorageService {

    // currentIndex = 0;
    // currentPhotos;

    constructor(
    ) { }

    getHashtags(id: number): HashtagCategory[] {
        return HASHTAGS;
    }

    getUserSelectedHashtags(id: number): Hashtag[] {
        return [
            new Hashtag({ title: "#bike" }),
            new Hashtag({ title: "#urban" }),
            new Hashtag({ title: "#art" }),
            new Hashtag({ title: "#street" }),
            new Hashtag({ title: "#bike" }),
            new Hashtag({ title: "#urban" }),
            new Hashtag({ title: "#bike" }),
            new Hashtag({ title: "#hello" }),
            new Hashtag({ title: "#universe" }),
            new Hashtag({ title: "#whatsup" }),
        ];
    }

    getUserNotSelectedHashtags(id: number): Hashtag[] {
        var allHashtags = this.getHashtags(id);
        var userSelectedHashtags = this.getUserSelectedHashtags(id);
        // get allHashtags that not contain userSelectedHashtags

        // mock -->
        return  [
            new Hashtag({ title: "#bike" }),
            new Hashtag({ title: "#urban" }),
            new Hashtag({ title: "#art" }),
            new Hashtag({ title: "#bike" }),
            new Hashtag({ title: "#hello" }),
            new Hashtag({ title: "#universe" }),
            new Hashtag({ title: "#whatsup" }),
        ];
    }

    /*
    onStartup()
        loadStorage()

    onChange()
        saveStorage()
    
    getHashtags()

    getPhoto()

    getDetailsLikeDate()

    */
    
}
