import { Injectable, EventEmitter } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PhotosCountService {
  private keyPayedPhotos: string = 'payedPhotosAmount';
  private keyTotalPayedPhotos: string = 'payedTotalPhotosAmount';
  private keyFreePhotos: string = 'freePhotosAmount';
  private keyFreeDate: string = 'freePhotosDate';
  public changedAmount: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly userService: UserService
  ) {}

  public initFreePhotos(): void {
    if (this.localStorageService.has(this.keyFreePhotos)) {
      return;
    }
    this.setFreeCount(environment.freePhotosStart);
  }

  public getTotalCount(): number {
    let totalAmount = 0;
    totalAmount += this.getTotalPayedCount();
    totalAmount += environment.freePhotosStart;
    const isAppRated = this.userService.isAppRated();
    if (isAppRated) {
      totalAmount += environment.freePhotosRateApp;
    }
    return totalAmount;
  }

  public getRemainingCount(): number {
    let totalAmount = 0;
    totalAmount += this.getPayedCount();
    totalAmount += this.getFreeCount();
    const isAppRated = this.userService.isAppRated();
    if (isAppRated) {
      totalAmount += environment.freePhotosRateApp;
    }
    return totalAmount;
  }

  public decrease(): boolean {
    const totalAmount = this.getRemainingCount();
    if (totalAmount <= 0) {
      return false;
    }

    let amountPayed = this.getPayedCount();
    if (amountPayed >= 1) {
      amountPayed--;
      this.setPayedCount(amountPayed);
    } else {
      let freeAmount = this.getFreeCount();
      freeAmount--;
      this.setFreeCount(freeAmount);
    }
    this.changedAmount.emit();
    return true;
  }

  public addPayedPhotos(count: number): void {
    let amountPayed = this.getPayedCount();
    amountPayed += count;
    this.setPayedCount(amountPayed);

    const totalPaid = this.getTotalPayedCount();
    this.setTotalPayedCount(totalPaid + count);

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

  private getTotalPayedCount(): number {
    return Number(this.localStorageService.get(this.keyTotalPayedPhotos) || 0);
  }

  private setFreeCount(amount: number): void {
    this.localStorageService.set(this.keyFreePhotos, amount);
    const dateNow = (Date.now() / 1000) | 0;
    this.localStorageService.set(this.keyFreeDate, dateNow);
  }

  private setPayedCount(amount: number): void {
    this.localStorageService.set(this.keyPayedPhotos, amount);
  }

  private setTotalPayedCount(amount: number): void {
    this.localStorageService.set(this.keyTotalPayedPhotos, amount);
  }

}
