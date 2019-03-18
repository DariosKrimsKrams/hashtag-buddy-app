import { Injectable } from "@angular/core";
import { HASHTAGS } from "~/app/home/data/hashtags";
import { HashtagCategory } from "~/app/models/hashtag-category";
import { Hashtag } from "~/app/models/hashtag";
import { User } from "../models/user";
import { Photo } from "../models/photo";
let LocalStorage = require( "nativescript-localstorage" );
 
@Injectable({
    providedIn: "root"
})
export class UserStorageService {

    // currentIndex = 0;
    // currentPhotos;

    constructor(
    ) { }

    init() {
    }

    private isEmpty(): boolean {
        return LocalStorage.length == 0;
    }

    public hasUserId(): string {
        return LocalStorage.getItem('x');
    }

    public setUserId(value: string): void {
        LocalStorage.setItem('x', value);
    }

    public setPhoto(Pho) {
        
    }

    public getPhoto(id: number): Photo {
        return null;
    }

    public getPhotos(): Photo[] {
        return null;
    }

    public getUser() {
        var user = new User();
        user.photos = this.getPhotos();
        return user;
    }

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
