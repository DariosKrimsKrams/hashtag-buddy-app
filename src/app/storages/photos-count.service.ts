import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { environment } from '../environments/environment';
 
@Injectable({
    providedIn: "root"
})
export class PhotosCountService {

    private keyFreePhotos: string = 'freePhotosAmount';
    private keyFreeDate: string = 'freePhotosDate';

    constructor(
        private dataService: DataService,
    ) { }

    public initFreePhotos(): void {
        if(!this.dataService.has(this.keyFreePhotos)) {
            return;
        }
        this.setCount(environment.freePhotosStart);
    }

    private setCount(amount: number): void {
        this.dataService.set(this.keyFreePhotos, amount);
        var dateNow = Date.now() / 1000 | 0;
        this.dataService.set(this.keyFreeDate, dateNow);
    }

    public getCount(): number {
        var amount = Number(this.dataService.get(this.keyFreePhotos) || 0);
        if(amount > 0) {
            return amount;
        }
        if(this.checkTimeAndIncrease()) {
            return 1;
        }
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
        return true;
    }

    public getDate(): number {
        return Number(this.dataService.get(this.keyFreeDate));
    }
    
}
