import { Injectable, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Photo } from '../models/photo';
import { Transaction } from 'nativescript-purchase/transaction';
import { MyHashtag } from '../models/my-hashtag';
import { screen } from 'tns-core-modules/platform';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private keyPhotos: string = 'photos';
  private keyPurchases: string = 'purchases';
  private keyFavorites: string = 'favorites';
  private keyRateApp: string = 'rateapp2';
  private keyTipsTricks: string = 'hasUnlockedTipsTricks';
  private photosCache: Photo[];
  @Output() public photoAdded: EventEmitter<Photo[]> = new EventEmitter<Photo[]>();
  @Output() public photoUpdated: EventEmitter<Photo[]> = new EventEmitter<Photo[]>();
  @Output() public androidBackTriggered: EventEmitter<string> = new EventEmitter<string>();
  @Output() public uploadFailedTriggered: EventEmitter<string> = new EventEmitter<string>();
  @Output() public uploadCompletedTriggered: EventEmitter<string> = new EventEmitter<string>();
  @Output() public openFeedbackModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() public openPage: EventEmitter<string> = new EventEmitter<string>();
  @Output() public appRatedTriggered: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly localStorageService: LocalStorageService
  ) {}

  public addPhoto(photo: Photo): number {
    const photos = this.getPhotos();
    photo.id = photos.length === 0 ? 1 : photos[photos.length - 1].id + 1;
    photos.push(photo);
    this.setPhotos(photos);
    this.photoAdded.emit(photos);
    return photo.id;
  }

  public deletePhoto(deletePhoto: Photo): boolean {
    const photos = this.getPhotos();
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (photo.id === deletePhoto.id) {
        photos.splice(i, 1);
        this.setPhotos(photos);
        return true;
      }
    }
    return false;
  }

  public updatePhoto(photo: Photo): void {
    const photos = this.getPhotos();
    for (let i = 0; i < photos.length; i++) {
      if (photos[i].id === photo.id) {
        photos[i] = photo;
        break;
      }
    }
    this.setPhotos(photos);
    this.photoUpdated.emit(photos);
  }

  public getPhoto(id: number): Photo {
    const photos = this.getPhotos();
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (photo.id === id) {
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
    const json = this.localStorageService.get(this.keyPhotos) || undefined;
    if (json === undefined) {
      this.photosCache = [];
      return [];
    }
    const jsonAsObj = JSON.parse(json);
    const photos: Photo[] = [];
    for (let i = 0; i < jsonAsObj.length; i++) {
      const photo = new Photo();
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
    const purchases = this.getExistingPurchases();
    purchases.push(transaction);
    this.localStorageService.set(this.keyPurchases, purchases);
  }

  public hasPurchase(): boolean {
    return this.getExistingPurchases().length !== 0;
  }

  private getExistingPurchases(): Transaction[] {
    const json = this.localStorageService.get(this.keyPurchases) || undefined;
    if (json === undefined) {
      return [];
    }
    return JSON.parse(json) as Transaction[];
  }

  public setFavorites(hashtags: MyHashtag[]): void {
    this.localStorageService.set(this.keyFavorites, hashtags);
  }

  public getFavorites(): MyHashtag[] {
    const json = this.localStorageService.get(this.keyFavorites) || undefined;
    if (json === undefined) {
      return [];
    }
    return JSON.parse(json) as MyHashtag[];
  }

  public getRateAppStatus(): string {
    return this.localStorageService.get(this.keyRateApp) || undefined;
  }

  public isAppRated(): boolean {
    return this.getRateAppStatus() === 'rated';
  }

  public saveRateAppStatus(value: string): void {
    this.localStorageService.set(this.keyRateApp, value);
  }

  public hasTipsTricksUnlocked(): boolean {
    return this.localStorageService.get(this.keyTipsTricks) === 'true' || undefined;
  }

  public unlockedTipsTricks(): void {
    this.localStorageService.set(this.keyTipsTricks, 'true');
  }

  public calcHeader(imgWidth: number, imgHeight: number, normalHeight: number): { height: number, top: number } {
    const screenWidth = screen.mainScreen.widthDIPs;
    const imgAspectRatio = imgWidth / imgHeight;
    const headerHeight = screenWidth / imgAspectRatio;

    const screenHeight = screen.mainScreen.heightDIPs;
    const targetHeaderSpace = normalHeight / 731;
    let actualHeaderSpace = headerHeight / screenHeight;
    if (actualHeaderSpace < targetHeaderSpace) {
      actualHeaderSpace = targetHeaderSpace;
    }
    const spaceToReduce = actualHeaderSpace - targetHeaderSpace;
    const visibleHeight = headerHeight / actualHeaderSpace * (actualHeaderSpace - spaceToReduce);
    const marginTop = headerHeight - visibleHeight;

    const newHeaderHeight = Math.round(headerHeight);
    const headerTop = Math.round(marginTop * -1);

    return { height: newHeaderHeight, top: headerTop };
  }

}
