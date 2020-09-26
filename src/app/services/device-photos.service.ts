import { Injectable } from '@angular/core';
import { ImageAsset, ImageSource, knownFolders, path } from '@nativescript/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  public selectedPhoto: ImageAsset;

  constructor() {
    this.selectedPhoto = null;
  }

  public setSelectedPhoto(photo: ImageAsset): void {
    this.selectedPhoto = photo;
  }

  public getSelectedPhoto(): ImageAsset {
    return this.selectedPhoto;
  }

  public copyPhotoToAppFolder(image: ImageAsset): Observable<string> {
    return new Observable<string>(observer => {
      try {
        ImageSource.fromAsset(image).then(imageSource => {
          const targetFilename = 'img_' + new Date().getTime() + '.jpg';
          const tempPath = knownFolders.documents().path;
          const localFullPath = path.join(tempPath, targetFilename);
          const saved = imageSource.saveToFile(localFullPath, 'jpg');
          if (!saved) {
            console.log('Failed to save :\'(');
          }
          observer.next(localFullPath);
          observer.complete();
        });

      } catch (err) {
        console.log('error', err);
      }
    });
  }

}
