import { Injectable } from "@angular/core";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";
import { environment } from '../environments/environment';
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

    private EvaluationUrl = environment + "/Evaluation/File/";

    public UploadPhoto(feedback: Evaluation): Observable<Evaluation> {
        return this.http.post<Evaluation>(this.EvaluationUrl, feedback);
    }

    public setSelectedPhoto(photo: ImageAsset): void {
        this.selectedPhoto = photo;
    }

    public getSelectedPhoto(): ImageAsset {
        return this.selectedPhoto;
    }

}
