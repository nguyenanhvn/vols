import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
//import * as $ from 'jquery';
// import 'jquery-ui';

import { ConfigSettings } from "./app.config";
import { HttpService } from "./http.service";

import { MainComponent, ROUTES } from './main.component';
import { Step01Component } from './step_01/app.component';
import { Step02Component } from './step_02/app.component';
import { Step03Component } from './step_03/app.component';
import { Step04Component } from './step_04/app.component';
import { Step05Component } from './step_05/app.component';
import { Step06Component } from './step_06/app.component';

// スワイプ用のライブラリの設定 ここから
var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'swipe': { velocity: 0.4, threshold: 20, direction: DIRECTION_VERTICAL } // override default settings
  }
}
// スワイプ用のライブラリの設定 ここまで

@NgModule({
  declarations: [
    MainComponent,
    Step01Component,
    Step02Component,
    Step03Component,
    Step04Component,
    Step05Component,
    Step06Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    Ng2BootstrapModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    ConfigSettings,
    HttpService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [MainComponent]
})
export class AppModule { }
