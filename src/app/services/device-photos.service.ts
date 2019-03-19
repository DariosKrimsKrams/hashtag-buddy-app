import { Injectable } from "@angular/core";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";
// import { path } from "file-system";
// import { android } from "tns-core-modules/application/application";
// import {Folder, path, knownFolders} from "tns-core-modules/file-system";

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Evaluation } from '~/app/models/evaluation';

@Injectable({
    providedIn: "root"
})
export class DeviceService {

    selectedPhoto: ImageAsset;

    constructor(
        private http: HttpClient,
    ) {
        this.selectedPhoto = null;
    }

    private EvaluationUrl = "http://instaq-api.innocliq.de/Evaluation/File/";

    Evaluation (feedback: Evaluation): Observable<Evaluation> {
        return this.http.post<Evaluation>(this.EvaluationUrl, feedback);
    }

    setSelectedPhoto(photo: ImageAsset): void {
        this.selectedPhoto = photo;
    }

    getSelectedPhoto(): ImageAsset {
        return this.selectedPhoto;
    }

}
