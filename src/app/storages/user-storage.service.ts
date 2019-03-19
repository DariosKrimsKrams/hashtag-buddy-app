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

    public clearAll(): void {
        LocalStorage.removeItem('photos');
        LocalStorage.removeItem('userId');
    }

    private isEmpty(): boolean {
        return LocalStorage.length == 0;
    }

    public getUserId(): string {
        return LocalStorage.getItem('userId') || undefined;
    }

    public hasUserId(): boolean {
        return this.getUserId() !== undefined;
    }

    public setUserId(userId: string): void {
        var value = JSON.stringify(userId);
        LocalStorage.setItem('userId', value);
    }

    public setPhoto(photo: Photo) {
        // check if exists
        var photos = this.getPhotos();
        photos[photos.length] = photo;
        this.savePhotos(photos);
    }

    public updatePhoto(photo: Photo) {
        
    }

    private savePhotos(photos: Photo[]) {
        var value = JSON.stringify(photos);
        LocalStorage.setItem('photos', value);
    }

    public getPhoto(id: number): Photo {
        var photos = this.getPhotos();
        for(let i = 0; i < photos.length ; i++) {
            var photo = photos[i];
            if(photo.id == id) {
                return photo;
            }
        }
        return undefined;
    }

    public getPhotos(): Photo[] {
        var json = LocalStorage.getItem('photos') || undefined;
        if(json == undefined) {
            return [];
        }
        var jsonAsObj = JSON.parse(json);
        var photos: Photo[] = [];
        for(let i = 0; i < jsonAsObj.length ; i++) {
            let photo = new Photo();
            Object.assign(photo, jsonAsObj[i]);
            photos[i] = photo;
        }
        return photos;
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
