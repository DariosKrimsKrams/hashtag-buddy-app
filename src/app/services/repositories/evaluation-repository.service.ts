import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subscriber } from 'rxjs';
import * as bgHttp from 'nativescript-background-http';
import { IHttpResponse } from '../../models/request/http-response';
import { SearchRequest } from '~/app/models/request/search-request';
import { request } from 'tns-core-modules/http';
import { SearchMultipleRequest } from '~/app/models/request/search-multiple-request';

@Injectable({
  providedIn: 'root',
})
export class EvaluationRepository {

  public tasks: bgHttp.Task[] = [];
  private session: any;
  private observer: Subscriber<any>;
  private file: string;
  private filename: string;

  constructor(
  ) { }

  private evaluationUrl = environment.apiUrl + '/Evaluation/File/';
  private searchUrl = environment.apiUrl + '/Evaluation/Search/';
  private searchMultipleUrl = environment.apiUrl + '/Evaluation/SearchMultiple/';

  public uploadPhoto(filepath: string, customerId: string): Observable<IHttpResponse> {
    this.file = filepath;
    this.filename = filepath.substr(filepath.lastIndexOf('/') + 1);
    this.session = bgHttp.session(`image-upload_${this.filename}`);
    return new Observable<IHttpResponse>(observer => this.uploadLogic.bind(this)(observer, customerId));
  }

  public search(data: SearchRequest): Observable<IHttpResponse> {
    return new Observable<any>(observer => {
      request({
        url: this.searchUrl,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        content: JSON.stringify(data)
      }).then((response) => {
        const result = response.content.toJSON();
        observer.next(result);
        observer.complete();
      }, (e) => {
        console.error('error', e);
      });
    });
  }

  public searchMultiple(data: SearchMultipleRequest): Observable<IHttpResponse> {
    return new Observable<any>(observer => {
      request({
        url: this.searchMultipleUrl,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        content: JSON.stringify(data)
      }).then((response) => {
        const result = response.content.toJSON();
        observer.next(result);
        observer.complete();
      }, (e) => {
        console.error('error', e);
      });
    });
  }

  private uploadLogic(observer: any, customerId: string): void {
    this.observer = observer;
    const config = {
        url: this.evaluationUrl + customerId,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data; boundary',
            'File-Name': this.filename
        },
        description: `Uploading ${this.filename}`,
        androidAutoDeleteAfterUpload: false,
    };
    const params = [
        { name: 'file', filename: this.file, mimeType: 'image/jpeg' }
    ];
    const task = this.session.multipartUpload(params, config);
    task.on('error', this.handleError.bind(this));
    task.on('cancelled', this.handleCancelled.bind(this));
    task.on('responded', this.handleReponded.bind(this));
    task.on('complete', this.handleComplete.bind(this));
    this.tasks.push(task);
  }
  private handleError(e): void {
    const httpStatus: IHttpResponse = {status: 'error', code: e.responseCode, message: e.response};
    this.observer.next(httpStatus);
    this.observer.complete();
  }
  private handleCancelled(e): void {
    const httpStatus: IHttpResponse = {status: 'error', code: e.responseCode, message: e.response};
    this.observer.next(httpStatus);
    this.observer.complete();
  }
  private handleReponded(e): void {
    const httpStatus: IHttpResponse = {status: 'successful', code: e.responseCode, message: e.data};
    this.observer.next(httpStatus);
    this.observer.complete();
  }
  private handleComplete(e): void {
    const httpStatus: IHttpResponse = {status: 'successful', code: e.responseCode, message: e.data};
    this.observer.next(httpStatus);
    this.observer.complete();
  }

}
