import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { CustomerRepository } from "../services/customer-repository.service";
import { HASHTAGS } from "~/app/home/data/hashtags";
import { HashtagCategory } from "~/app/models/hashtag-category";
import { Hashtag } from "~/app/models/hashtag";
import { Photo } from "../models/photo";
 
@Injectable({
    providedIn: "root"
})
export class UserService {

    private keyUserId: string = 'userId';
    private keyPhotos: string = 'photos';

    constructor(
        private dataService: DataService,
        private customerRepositoryService: CustomerRepository
    ) { }

    public debug(): void {
        console.log("UserService debug()");
        // this.clearAll();

        console.log("UserId: " + this.getUserId());
        var photos = this.getPhotos();
        console.log("Photos Count: ", photos.length);
        // photos.forEach(photo => {
        //     console.log(photo);
        // });
        // console.log("Photos end");
    }

    public addPhoto(photo: Photo): number {
        console.log("addPhoto()");
        var photos = this.getPhotos();
        photo.id = photos.length + 1;
        photos.push(photo);
        this.dataService.setObject(this.keyPhotos, photos);
        return photo.id;
    }

    public updatePhoto(photo: Photo): void {
        console.log("updatePhoto()");
        var photos = this.getPhotos();
        photos[photo.id-1] = photo;
        this.dataService.setObject(this.keyPhotos, photos);
    }

    public getPhoto(id: number): Photo {
        console.log("getPhoto()");
        var json = this.dataService.get(this.keyPhotos) || undefined;
        if(json === undefined) {
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
        console.log("getPhotos()");
        var json = this.dataService.get(this.keyPhotos) || undefined;
        if(json === undefined) {
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

    public createUserIdIfNotExist(): void {
        console.log("createUserIdIfNotExist()");
        if(this.dataService.has(this.keyUserId)) {
            return;
        }
        this.customerRepositoryService.createCustomer().subscribe(result => {
            this.dataService.setString(this.keyUserId, result.customerId);
        });
    }

    public getUserId(): string {
        console.log("getUserId()")
        return this.dataService.get(this.keyUserId);
    }

    public clearAll(): void {
        console.log("clearAll()")
        this.dataService.remove(this.keyPhotos);
        this.dataService.remove(this.keyUserId);
    }

    /***********/

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
