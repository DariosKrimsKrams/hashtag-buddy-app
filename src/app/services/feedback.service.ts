import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Feedback } from '~/app/models/feedback';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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

  private url = "/Feedback/App";

  addFeedback (feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(this.url, feedback, httpOptions);
  }

}