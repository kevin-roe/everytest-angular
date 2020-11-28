import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private REST_API_SERVER = "http://localhost:3001/";

  constructor(private httpClient: HttpClient) { }

  public get<T>(path: string){
    return this.httpClient.get<T>(this.REST_API_SERVER + path, { withCredentials: true });
  }

  public post<T>(path: string, request: any) {
    return this.httpClient.post<T>(this.REST_API_SERVER + path, request, { withCredentials: true });
  }

  public put<T>(path: string, request: any) {
    return this.httpClient.put<T>(this.REST_API_SERVER + path, request, { withCredentials: true });
  }

  public delete<T>(path: string) {
    return this.httpClient.delete<T>(this.REST_API_SERVER + path, { withCredentials: true });
  }
}
