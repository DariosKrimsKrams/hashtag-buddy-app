import { Injectable } from "@angular/core";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";

@Injectable({
    providedIn: "root"
})
export class DeviceService {

    selectedPhoto: ImageAsset;

    constructor(
    ) {
        this.selectedPhoto = null;
    }

    public setSelectedPhoto(photo: ImageAsset): void {
        this.selectedPhoto = photo;
    }

    public getSelectedPhoto(): ImageAsset {
        return this.selectedPhoto;
    }

}
