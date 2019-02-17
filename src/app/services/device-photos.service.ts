import { Injectable } from "@angular/core";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";
// import { path } from "file-system";
// import { android } from "tns-core-modules/application/application";
// import {Folder, path, knownFolders} from "tns-core-modules/file-system";

@Injectable({
    providedIn: "root"
})
export class DeviceService {

    selectedPhoto: ImageAsset;

    constructor(
    ) {
        this.selectedPhoto = null;
    }

    getPhotos() {
    
        // knownFolders.

        // var path = android.os.Environment.DIRECTORY_DCIM).getAbsolutePath();
        // var filename = "20160719_155053.jpg";
        // var tempPicturePath = path.join(android.os.Environment.getExternalStoragePublicDirectory(path, filename);
        // console.log("extr storage "+tempPicturePath);


    }

    setSelectedPhoto(photo: ImageAsset): void {
        this.selectedPhoto = photo;
    }

    getSelectedPhoto(): ImageAsset {
        return this.selectedPhoto;
    }

}
