import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
var bghttp = require("nativescript-background-http");

@Injectable({
  providedIn: 'root',
})

export class EvaluationRepository {

  constructor(
  ) { }

  private evaluationUrl = environment.apiUrl + "/Evaluation/File/";

    public UploadPhoto(path: string, customerId: string): any {
        // file path and url
        // var file =  "/some/local/file/path/and/file/name.jpg";
        // var url = "https://some.remote.service.com/path";
        var filename = path.substr(path.lastIndexOf("/") + 1);

        // upload configuration
        var session = bghttp.session("image-upload");
        var request = {
            url: this.evaluationUrl,
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream"
            },
            description: "Uploading " + filename
        };

        var task = session.uploadFile("file", request);

        task.on("progress", this.progressHandler);
        task.on("error", this.errorHandler);
        task.on("responded", this.respondedHandler);
        task.on("complete", this.completeHandler);
        task.on("cancelled", this.cancelledHandler); // Android only
      
    }

    // event arguments:
    // task: Task
    // currentBytes: number
    // totalBytes: number
    private progressHandler(e) {
        alert("uploaded " + e.currentBytes + " / " + e.totalBytes);
    }

    // event arguments:
    // task: Task
    // responseCode: number
    // error: java.lang.Exception (Android) / NSError (iOS)
    // response: net.gotev.uploadservice.ServerResponse (Android) / NSHTTPURLResponse (iOS)
    private errorHandler(e) {
        alert("received " + e.responseCode + " code.");
        var serverResponse = e.response;
    }


    // event arguments:
    // task: Task
    // responseCode: number
    // data: string
    private respondedHandler(e) {
        alert("received " + e.responseCode + " code. Server sent: " + e.data);
    }

    // event arguments:
    // task: Task
    // responseCode: number
    // response: net.gotev.uploadservice.ServerResponse (Android) / NSHTTPURLResponse (iOS)
    private completeHandler(e) {
        alert("received " + e.responseCode + " code");
        var serverResponse = e.response;
    }

    // event arguments:
    // task: Task
    private cancelledHandler(e) {
        alert("upload cancelled");
    }


}