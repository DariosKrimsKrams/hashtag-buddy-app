import { Injectable } from '@angular/core';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { ImageSource } from 'tns-core-modules/image-source';
import { knownFolders, path } from 'tns-core-modules/file-system/file-system';
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

  public deletePhoto(path: string): void {
    // const tempPath = knownFolders.documents().path;
    // ToDo remove image from disk
  }
}
