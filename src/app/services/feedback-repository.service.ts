import { Injectable } from '@angular/core';
import { request } from "tns-core-modules/http";
import { AppFeedback } from '~/app/models/app-feedback';
import { environment } from '../environments/environment';
import { ResultFeedbackRequest } from '../models/request/result-feedback-request';

@Injectable({
  providedIn: 'root',
})

export class FeedbackRepository {

  constructor(
  ) { }

  private appFeedbackUrl = environment.apiUrl + "/Feedback/App";
  private resultFeedbackUrl = environment.apiUrl + "/Feedback/Results";

  sendAppFeedback (feedback: AppFeedback): void {
    request({
      url: this.appFeedbackUrl,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      content: JSON.stringify(feedback)
    }).then((result) => {
      console.log("result", result);
    }, (e) => {
      console.log("error", e);
    });
  }

  sendResultFeedback (feedback: ResultFeedbackRequest) {
    request({
      url: this.resultFeedbackUrl,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      content: JSON.stringify(feedback)
    }).then((response) => {
      // const result = response.content.toJSON();
      // console.log("result", result);
    }, (e) => {
      console.log("error", e);
    });
  }

}