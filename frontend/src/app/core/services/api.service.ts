import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class ApiService {
  private baseUrl = environment.apiUrl; // e.g. http://localhost:8080/api

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    // Normalize server error message for UI components
    console.error("API error", error);
    // Try to extract a useful message from known server response shapes
    let msg = "An error occurred";
    try {
      if (error?.error?.message) msg = error.error.message;
      else if (error?.message) msg = error.message;
      else if (typeof error === "string") msg = error;
    } catch (e) {
      // fall back to generic
    }

    // Preserve status and raw error for callers to inspect (useful for network errors/status 0)
    const errObj = {
      message: msg,
      status: error?.status ?? 0,
      raw: error,
    };

    return throwError(() => errObj);
  }

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${path}`, { params })
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${path}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${path}`)
      .pipe(catchError(this.handleError));
  }
}
