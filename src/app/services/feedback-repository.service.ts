import { Injectable } from '@angular/core';
import { getJSON } from "tns-core-modules/http";
import { AppFeedback } from '~/app/models/app-feedback';
import { ResultFeedback } from '~/app/models/result-feedback';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class FeedbackRepository {

  constructor(
    // private http: HttpClient,
  ) { }

  private appFeedbackUrl = environment.apiUrl + "/Feedback/App";
  private resultFeedbackUrl = environment.apiUrl + "/Feedback/Results";

  addAppFeedback (feedback: AppFeedback): void {
    
      // const observable = new Observable<EvaluationRequest>(observer => {
      //     request({
      //         url: this.EvaluationUrl,
      //         method: "POST",
      //         headers: { "Content-Type": "application/json" },
      //         content: JSON.stringify(feedback)
      //     }).then((response) => {
      //         const result = response.content.toJSON();
      //         observer.next(result);
      //         observer.complete();
      //     }, (e) => {
      //         console.log("error: ", e)
      //     });
      // });
      // return observable;
      
    // ToDo CHANGE TO POST
    getJSON(this.appFeedbackUrl).then((result: any) => {
      console.log("result", result);
    }, (e) => {
      console.log("error", e);
    });
    // return this.http.post<AppFeedback>(this.appFeedbackUrl, feedback, httpOptions);
  }

  addResultFeedback (feedback: ResultFeedback) {
    // ToDo CHANGE TO POST
    getJSON(this.resultFeedbackUrl).then((result: any) => {
      console.log("result", result);
    }, (e) => {
      console.log("error", e);
    });
    // return this.http.post<ResultFeedback>(this.resultFeedbackUrl, feedback, httpOptions);
  }

}