import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IEmployee } from './models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseUrl = 'http://localhost:3000/';

  constructor(private _http: HttpClient) {}

  getEmployees(): Observable<IEmployee[]> {
    return this._http.get<IEmployee[]>(`${this.baseUrl}employees`).pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }
}
