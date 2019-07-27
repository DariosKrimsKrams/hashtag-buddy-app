import { Injectable, EventEmitter } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotosCountService {
  private keyPayedPhotos: string = 'payedPhotosAmount';
  private keyFreePhotos: string = 'freePhotosAmount';
  private keyFreeDate: string = 'freePhotosDate';
  public changedAmount: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly localStorageService: LocalStorageService) {}

  public initFreePhotos(): void {
    if (this.localStorageService.has(this.keyFreePhotos)) {
      return;
    }
    this.setFreeCount(environment.freePhotosStart);
  }

  public getTotalCount(): number {
    let amountPayed = this.getPayedCount();
    let amountFree = this.getFreeCount();
    let amountTotal = amountPayed + amountFree;
    if (amountTotal === 0 && this.checkTimeOver()) {
      this.setFreeCount(environment.freePhotosIncreatingAmount);
      return environment.freePhotosIncreatingAmount;
    }
    return amountTotal;
  }

  public checkTimeOver(): boolean {
    let date = this.getDate();
    let dateNow = (Date.now() / 1000) | 0;
    if (date + environment.freePhotosIncreatingTime <= dateNow) {
      return true;
    }
    return false;
  }

  public decrease(): boolean {
    let amountTotal = this.getTotalCount();
    if (amountTotal === 0) {
      return false;
    }
    let amountPayed = this.getPayedCount();
    if (amountPayed > 1) {
      amountPayed--;
      this.setPayedCount(amountPayed);
    } else {
      let freeAmount = amountTotal - amountPayed;
      freeAmount--;
      this.setFreeCount(freeAmount);
    }
    this.changedAmount.emit();
    return true;
  }

  public addPayedPhotos(count: number): void {
    let amountPayed = this.getPayedCount();
    console.log('amount', amountPayed);
    amountPayed += count;
    this.setPayedCount(amountPayed);
    this.changedAmount.emit();
  }

  public hasPayedPhotos(): boolean {
    return this.getPayedCount() > 0;
  }

  public getDate(): number {
    return Number(this.localStorageService.get(this.keyFreeDate));
  }

  private getFreeCount(): number {
    return Number(this.localStorageService.get(this.keyFreePhotos) || 0);
  }

  private getPayedCount(): number {
    return Number(this.localStorageService.get(this.keyPayedPhotos) || 0);
  }

  private setFreeCount(amount: number): void {
    this.localStorageService.set(this.keyFreePhotos, amount);
    let dateNow = (Date.now() / 1000) | 0;
    this.localStorageService.set(this.keyFreeDate, dateNow);
  }

  private setPayedCount(amount: number): void {
    this.localStorageService.set(this.keyPayedPhotos, amount);
  }
}
