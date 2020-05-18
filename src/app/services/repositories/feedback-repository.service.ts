import { Injectable } from '@angular/core';
import { request } from 'tns-core-modules/http';
import { AppFeedback } from '~/app/models/app-feedback';
import { environment } from '../../environments/environment';
import { ResultFeedbackRequest } from '../../models/request/result-feedback-request';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})

export class FeedbackRepository {

  constructor(
  ) { }

  private appFeedbackUrl = environment.apiUrl + '/Feedback/App';
  private resultFeedbackUrl = environment.apiUrl + '/Feedback/Results';

  public sendAppFeedback(feedback: AppFeedback): Observable<any> {
    return new Observable<any>(observer => {
      request({
        url: this.appFeedbackUrl,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        content: JSON.stringify(feedback)
      }).then((_response) => {
        observer.next();
        observer.complete();
      }, (e) => {
        console.error('error sendAppFeedback: ' + e);
        observer.complete();
      });
    });
  }

  public sendResultFeedback(feedback: ResultFeedbackRequest): void {
    request({
      url: this.resultFeedbackUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      content: JSON.stringify(feedback)
    }).then((_response) => {
    }, (e) => {
      console.error('error sendResultFeedback: ' + e);
    });
  }

}