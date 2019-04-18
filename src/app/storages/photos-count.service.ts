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

        console.log(this.localStorageService.get(this.keyFreePhotos))
        console.log(this.localStorageService.get(this.keyFreeDate))

        if(this.localStorageService.has(this.keyFreePhotos)) {
            return;
        }
        this.setCount(environment.freePhotosStart);
    }

    public getCount(): number {
        var amount = Number(this.localStorageService.get(this.keyFreePhotos) || 0);
        if(amount > 0) {
            return amount;
        }
        // if(this.checkTimeAndIncrease()) {
        //     return 1;
        // }
        return 
    }

    public checkTimeAndIncrease(): boolean {
        var date = this.getDate();
        var dateNow = Date.now() / 1000 | 0;
        if(date + environment.freePhotosIncreatingTime >= dateNow) {
            this.setCount(environment.freePhotosIncreatingAmount);
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
