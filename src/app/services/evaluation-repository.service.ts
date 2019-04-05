import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, Subscriber } from 'rxjs';
import * as bgHttp from "nativescript-background-http";
import { IHttpResponse } from '../models/request/http-response';

@Injectable({
  providedIn: 'root',
})
export class EvaluationRepository {

  public tasks: bgHttp.Task[] = [];
  private session: any;
  private observer: Subscriber<any>;
  private file: string;
  private filename: string;
  private customerId: string;

  constructor(
  ) { }

  private evaluationUrl = environment.apiUrl + "/Evaluation/File/";

    public UploadPhoto(filepath: string, customerId: string): Observable<IHttpResponse> {
        this.file = filepath;
        this.filename = filepath.substr(filepath.lastIndexOf("/") + 1);
        this.customerId = customerId;
        this.session = bgHttp.session(`image-upload_${this.filename}`);
        return new Observable<IHttpResponse>(observer => this.uploadLogic.bind(this)(observer));
    }

    private uploadLogic(observer): void {
        this.observer = observer;
        var config = {
            url: this.evaluationUrl + this.customerId,
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data; boundary",
                "File-Name": this.filename
            },
            description: `Uploading ${this.filename}`,
            androidAutoDeleteAfterUpload: false,
        };
        var params = [
            { name: "file", filename: this.file, mimeType: "image/jpeg" }
        ];
        var task = this.session.multipartUpload(params, config);
        task.on("error", this.errorHandler.bind(this));
        task.on("responded", this.respondedHandler.bind(this));
        this.tasks.push(task);
    }

    private errorHandler(e): void {
        var httpStatus: IHttpResponse = {status: 'error', code: e.responseCode, message: e.response};
        this.observer.next(httpStatus);
        this.observer.complete();
    }


    private respondedHandler(e): void {
        var httpStatus: IHttpResponse = {status: 'successful', code: e.responseCode, message: e.data};
        this.observer.next(httpStatus);
        this.observer.complete();
    }


}