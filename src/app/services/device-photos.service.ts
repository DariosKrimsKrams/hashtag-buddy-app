import { Injectable } from "@angular/core";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";
import { environment } from '../environments/environment';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { request } from "tns-core-modules/http";
import { Observable, of } from 'rxjs';
import { Evaluation } from '~/app/models/evaluation';
import { EvaluationRequest } from "../models/request/evaluation-request";

@Injectable({
    providedIn: "root"
})
export class DeviceService {

    selectedPhoto: ImageAsset;

    constructor(
        // private http: HttpClient,
    ) {
        this.selectedPhoto = null;
    }

    private EvaluationUrl = environment.apiUrl + "/Evaluation/File/";

    public UploadPhoto(feedback: Evaluation): Observable<EvaluationRequest> {
        const observable = new Observable<EvaluationRequest>(observer => {
            request({
                url: this.EvaluationUrl,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify(feedback)
            }).then((response) => {
                const result = response.content.toJSON();
                observer.next(result);
                observer.complete();
            }, (e) => {
            });
        });
        return observable;

        // return this.http.post<Evaluation>(this.EvaluationUrl, feedback);
    }

    public setSelectedPhoto(photo: ImageAsset): void {
        this.selectedPhoto = photo;
    }

    public getSelectedPhoto(): ImageAsset {
        return this.selectedPhoto;
    }

}
