import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppFeedback } from '~/app/models/app-feedback';
import { ResultFeedback } from '~/app/models/result-feedback';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class FeedbackService {

  constructor(
    private http: HttpClient,
  ) { }

  private AppFeedbackUrl = "http://instaq-api.innocliq.de/Feedback/App";
  private ResultFeedbackUrl = "http://instaq-api.innocliq.de/Feedback/Results";

  addAppFeedback (feedback: AppFeedback): Observable<AppFeedback> {
    return this.http.post<AppFeedback>(this.AppFeedbackUrl, feedback, httpOptions);
  }

  addResultFeedback (feedback: ResultFeedback): Observable<ResultFeedback> {
    return this.http.post<ResultFeedback>(this.ResultFeedbackUrl, feedback, httpOptions);
  }

}