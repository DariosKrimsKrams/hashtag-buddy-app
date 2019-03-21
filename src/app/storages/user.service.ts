import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { CustomerRepositoryService } from "../services/customer-repository.service";
import { HASHTAGS } from "~/app/home/data/hashtags";
import { HashtagCategory } from "~/app/models/hashtag-category";
import { Hashtag } from "~/app/models/hashtag";
import { User } from "../models/user";
import { Photo } from "../models/photo";
 
@Injectable({
    providedIn: "root"
})
export class UserService {

    private keyUserId: string = 'userId';
    private keyPhotos: string = 'userId';

    constructor(
        private dataService: DataService,
        private customerRepositoryService: CustomerRepositoryService
    ) { }

    init() {
        this.onStartup();
        console.log("UserService init");
    }

    public onStartup(): void {
        this.createUserIdIfNotExist();

        console.log("Photos: ");
        var photos = this.getPhotos();
        photos.forEach(photo => {
            console.log(photo);
        });
    }

    public setPhoto(photo: Photo) {
        var photos = this.getPhotos();
        photo.id = photos.length + 1;
        photos[photos.length] = photo;
        this.dataService.set(this.keyPhotos, photos);
        return photo.id;
    }

    public getPhoto(id: number): Photo {
        var json = this.dataService.get(this.keyPhotos) || undefined;
        if(json == undefined) {
            return undefined;
        }
        var jsonAsObj = JSON.parse(json);
        var key = id - 1;
        if(jsonAsObj.length < key) {
            return undefined;
        }
        let photo = new Photo();
        Object.assign(photo, jsonAsObj[key]);
        return photo;
    }

    public getPhotos(): Photo[] {
        var json = this.dataService.get(this.keyPhotos) || undefined;
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

    private createUserIdIfNotExist(): void {
        if(this.dataService.has(this.keyUserId)) {
            return;
        }
        var that = this;
        this.customerRepositoryService.createCustomer().subscribe(customerId => {
            that.dataService.set(this.keyUserId, customerId);
        });
    }

    public getUserId(): string {
        return this.dataService.get(this.keyUserId);
    }

    public getHashtags(id: number): HashtagCategory[] {
        return HASHTAGS;
    }

    public getUserSelectedHashtags(id: number): Hashtag[] {
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

    public getUserNotSelectedHashtags(id: number): Hashtag[] {
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
