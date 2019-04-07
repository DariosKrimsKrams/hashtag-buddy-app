import { Injectable, Output, EventEmitter } from "@angular/core";
import { DataService } from "./data.service";
import { CustomerRepository } from "../services/customer-repository.service";
import { HashtagCategory } from "~/app/models/hashtag-category";
import { Hashtag } from "~/app/models/hashtag";
import { Photo } from "../models/photo";
 
@Injectable({
    providedIn: "root"
})
export class UserService {

    private keyUserId: string = 'userId';
    private keyPhotos: string = 'photos';
    @Output() public photoAdded: EventEmitter<Photo[]> = new EventEmitter<Photo[]>();

    constructor(
        private dataService: DataService,
        private customerRepositoryService: CustomerRepository
    ) { }

    public debug(): void {
        // console.log("UserService debug()");
        // this.clearAll();

        // console.log("UserId: " + this.getUserId());
        // var photos = this.getPhotos();
        // console.log("Photos Count: ", photos.length);
        // photos.forEach(photo => {
        //     console.log(photo);
        // });
        // console.log("Photos end");
    }

    public addPhoto(photo: Photo): number {
        var photos = this.getPhotos();
        photo.id = photos[photos.length-1].id + 1;
        photos.push(photo);
        this.dataService.setObject(this.keyPhotos, photos);
        this.photoAdded.emit(photos);
        return photo.id;
    }

    public deletePhoto(deletePhoto: Photo): boolean {
        var photos = this.getPhotos();
        for(let i = 0; i < photos.length; i++) {
            var photo = photos[i];
            if(photo.id == deletePhoto.id) {
                photos.splice(i, 1);
                this.dataService.setObject(this.keyPhotos, photos);
                return true;
            }
        }
        return false;
    }

    public updatePhoto(photo: Photo): void {
        var photos = this.getPhotos();
        for(let i = 0; i < photos.length ; i++) {
            if(photos[i].id == photo.id) {
                photos[i] = photo;
                break;
            }
        }
        this.dataService.setObject(this.keyPhotos, photos);
    }

    public getPhoto(id: number): Photo {
        var json = this.dataService.get(this.keyPhotos) || undefined;
        if(json === undefined) {
            return undefined;
        }
        var jsonAsObj = JSON.parse(json);
        for(let i = 0; i < jsonAsObj.length ; i++) {
            let photo = new Photo();
            Object.assign(photo, jsonAsObj[i]);
            if(photo.id == id) {
                return photo;
            }
        }
        return undefined;
    }

    public getPhotos(): Photo[] {
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
        if(this.dataService.has(this.keyUserId)) {
            return;
        }
        this.customerRepositoryService.createCustomer().subscribe(result => {
            this.dataService.setString(this.keyUserId, result.customerId);
        });
    }

    public getUserId(): string {
        return this.dataService.get(this.keyUserId);
    }

    public clearAll(): void {
        this.dataService.remove(this.keyPhotos);
        this.dataService.remove(this.keyUserId);
    }
    
}
