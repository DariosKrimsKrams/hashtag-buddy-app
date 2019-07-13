import { Injectable, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Photo } from '../models/photo';
import { Transaction } from 'nativescript-purchase/transaction';
 
@Injectable({
    providedIn: 'root'
})
export class UserService {

    private keyPhotos: string = 'photos';
    private keyPurchases: string = 'purchases';
    private photosCache: Photo[];
    @Output() public photoAdded: EventEmitter<Photo[]> = new EventEmitter<Photo[]>();
    @Output() public photoUpdated: EventEmitter<Photo[]> = new EventEmitter<Photo[]>();

    constructor(
        private readonly localStorageService: LocalStorageService,
    ) { }

    public addPhoto(photo: Photo): number {
        let photos = this.getPhotos();
        photo.id = photos.length == 0 ? 1 : photos[photos.length - 1].id + 1;
        photos.push(photo);
        this.setPhotos(photos);
        this.photoAdded.emit(photos);
        return photo.id;
    }

    public deletePhoto(deletePhoto: Photo): boolean {
        let photos = this.getPhotos();
        for (let i = 0; i < photos.length; i++) {
            let photo = photos[i];
            if (photo.id == deletePhoto.id) {
                photos.splice(i, 1);
                this.setPhotos(photos);
                return true;
            }
        }
        return false;
    }

    public updatePhoto(photo: Photo): void {
        let photos = this.getPhotos();
        for (let i = 0; i < photos.length ; i++) {
            if (photos[i].id == photo.id) {
                photos[i] = photo;
                break;
            }
        }
        this.setPhotos(photos);
        this.photoUpdated.emit(photos);
    }

    public getPhoto(id: number): Photo {
        let photos = this.getPhotos();
        for (let i = 0; i < photos.length ; i++) {
            let photo = photos[i];
            if (photo.id == id) {
                return photo;
            }
        }
        return undefined;
    }

    private setPhotos(photos: Photo[]): void {
        this.localStorageService.set(this.keyPhotos, photos);
        this.photosCache = photos;
    }

    public getPhotos(): Photo[] {
        if (this.photosCache !== undefined) {
            return this.photosCache;
        }
        let json = this.localStorageService.get(this.keyPhotos) || undefined;
        if (json === undefined) {
            this.photosCache = [];
            return [];
        }
        let jsonAsObj = JSON.parse(json);
        let photos: Photo[] = [];
        for (let i = 0; i < jsonAsObj.length ; i++) {
            let photo = new Photo();
            Object.assign(photo, jsonAsObj[i]);
            photos[i] = photo;
        }
        this.photosCache = photos;
        return photos;
    }

    public countPhotos(): number {
        return this.getPhotos().length;
    }

    public clearAll(): void {
        this.localStorageService.remove(this.keyPhotos);
        this.photosCache = [];
    }

    public addPurchase(transaction: Transaction): void {
        let purchases = this.getExistingPurchases();
        purchases.push(transaction);
        this.localStorageService.set(this.keyPurchases, purchases);
    }

    private getExistingPurchases(): Transaction[] {
        let json = this.localStorageService.get(this.keyPurchases) || undefined;
        if (json === undefined) {
            return [];
        }
        let jsonAsObj = JSON.parse(json);
        let result = jsonAsObj as Transaction[];
        console.log(result);
        return result;
    }
    
}
