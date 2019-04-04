import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, Subscriber } from 'rxjs';
import * as bgHttp from "nativescript-background-http";

interface HttpResponse {
  status: string;
  code: number;
  message: string;
}

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

    public UploadPhoto(filepath: string, customerId: string): Observable<HttpResponse> {
        this.file = filepath;
        this.filename = filepath.substr(filepath.lastIndexOf("/") + 1);
        this.customerId = customerId;
        this.session = bgHttp.session("image-upload");
        return new Observable<HttpResponse>(observer => this.uploadLogic.bind(this)(observer));
    }

    private uploadLogic(observer): void {
        this.observer = observer;
        console.log(this);

        var config = {
            url: this.evaluationUrl + this.customerId,
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": this.filename
            },
            description: `Uploading ${this.filename}`,
            androidAutoDeleteAfterUpload: false,
        };

        var task = this.session.uploadFile(this.file, config);

        task.on("error", this.errorHandler.bind(this));
        task.on("responded", this.respondedHandler.bind(this));
        task.on("complete", this.completeHandler.bind(this));
        this.tasks.push(task);
    }

    private errorHandler(e): void {
        console.log("received " + e.responseCode + " code.");

        var httpStatus = {status: 'error', code: e.responseCode, message: e.response};
        this.observer.next(httpStatus);
        // this.observer.complete();
    }


    private respondedHandler(e): void {
        console.log("received " + e.responseCode + " code. Server sent: " + e.data);
        
        var httpStatus = {status: 'successful', code: e.responseCode, message: e.data};
        this.observer.next(httpStatus);
        // this.observer.complete();
    }

    private completeHandler(e): void {
        console.log("received " + e.responseCode + " code");
        var serverResponse = e.response;

        var httpStatus = {status: 'complete', code: e.responseCode, message: e.response};
        this.observer.next(httpStatus);
        this.observer.complete();
    }


}