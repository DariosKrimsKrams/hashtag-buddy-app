import { Injectable, Output, EventEmitter } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { CustomerRepository } from "../services/customer-repository.service";
import { HashtagCategory } from "~/app/models/hashtag-category";
import { Hashtag } from "~/app/models/hashtag";
import { Photo } from "../models/photo";
import { environment } from '../environments/environment';
 
@Injectable({
    providedIn: "root"
})
export class UserService {

    private keyUserId: string = 'userId';
    private keyPhotos: string = 'photos';
    private photosCache: Photo[];
    @Output() public photoAdded: EventEmitter<Photo[]> = new EventEmitter<Photo[]>();
    @Output() public photoUpdated: EventEmitter<Photo[]> = new EventEmitter<Photo[]>();

    constructor(
        private localStorageService: LocalStorageService,
        private customerRepositoryService: CustomerRepository
    ) { }

    public addPhoto(photo: Photo): number {
        var photos = this.getPhotos();
        photo.id = photos.length == 0 ? 1 : photos[photos.length-1].id + 1;
        photos.push(photo);
        this.setPhotos(photos);
        this.photoAdded.emit(photos);
        return photo.id;
    }

    public deletePhoto(deletePhoto: Photo): boolean {
        var photos = this.getPhotos();
        for(let i = 0; i < photos.length; i++) {
            var photo = photos[i];
            if(photo.id == deletePhoto.id) {
                photos.splice(i, 1);
                this.setPhotos(photos);
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
        this.setPhotos(photos);
        this.photoUpdated.emit(photos);
    }

    public getPhoto(id: number): Photo {
        var photos = this.getPhotos();
        for(let i = 0; i < photos.length ; i++) {
            let photo = photos[i];
            if(photo.id == id) {
                return photo;
            }
        }
        return undefined;
    }

    private setPhotos(photos: Photo[]) {
        this.localStorageService.set(this.keyPhotos, photos);
        this.photosCache = photos;
    }

    public getPhotos(): Photo[] {
        if(this.photosCache !== undefined) {
            return this.photosCache;
        }
        var json = this.localStorageService.get(this.keyPhotos) || undefined;
        if(json === undefined) {
            this.photosCache = [];
            return [];
        }
        var jsonAsObj = JSON.parse(json);
        var photos: Photo[] = [];
        for(let i = 0; i < jsonAsObj.length ; i++) {
            let photo = new Photo();
            Object.assign(photo, jsonAsObj[i]);
            photos[i] = photo;
        }
        this.photosCache = photos;
        return photos;
    }

    public createUserIdIfNotExist(): void {
        if(this.localStorageService.has(this.keyUserId)) {
            return;
        }
        this.customerRepositoryService.createCustomer().subscribe(result => {
            this.localStorageService.set(this.keyUserId, result.customerId);
        });
    }

    public getUserId(): string {
        return this.localStorageService.get(this.keyUserId);
    }

    public clearAll(): void {
        this.localStorageService.remove(this.keyPhotos);
        this.localStorageService.remove(this.keyUserId);
        this.photosCache = [];
    }
    
}
