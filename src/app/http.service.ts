import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ConfigSettings } from "./app.config";

@Injectable()
export class HttpService {

  constructor(
    private configSettings: ConfigSettings,//ConfigSettings DI
    private http: HttpClient
  ) {
  }

  //GET接続HTTPリクエストとレスポンス処理
  requestGetData(url: string) {
    // Make the HTTP request:
    return this.http.get(url);
  }
}


