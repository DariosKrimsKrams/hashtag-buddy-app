import { Injectable, EventEmitter } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { environment } from '../environments/environment';
 
@Injectable({
    providedIn: "root"
})
export class PhotosCountService {

    private keyFreePhotos: string = 'freePhotosAmount';
    private keyFreeDate: string = 'freePhotosDate';
    public changedData: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private localStorageService: LocalStorageService,
    ) { }

    public initFreePhotos(): void {
        if(this.localStorageService.has(this.keyFreePhotos)) {
            return;
        }
        this.setCount(environment.freePhotosStart);
    }

    public getCount(): number {
        var amount = Number(this.localStorageService.get(this.keyFreePhotos) || 0);
        if(amount == 0 && this.checkTimeOver()) {
            this.setCount(environment.freePhotosIncreatingAmount);
            return environment.freePhotosIncreatingAmount;
        }
        return amount;
    }

    public checkTimeOver(): boolean {
        var date = this.getDate();
        var dateNow = Date.now() / 1000 | 0;
        if(date + environment.freePhotosIncreatingTime <= dateNow) {
            return true;
        }
        return false;
    }

    public decreaseCount(): boolean {
        var amount = this.getCount();
        if(amount == 0) {
            return false;
        }
        amount--;
        this.setCount(amount);
        this.changedData.emit();
        return true;
    }

    public getDate(): number {
        return Number(this.localStorageService.get(this.keyFreeDate));
    }

    private setCount(amount: number): void {
        this.localStorageService.set(this.keyFreePhotos, amount);
        var dateNow = Date.now() / 1000 | 0;
        this.localStorageService.set(this.keyFreeDate, dateNow);
    }
    
}
