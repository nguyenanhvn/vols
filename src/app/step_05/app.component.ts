import { Component } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { ConfigSettings } from "../app.config";
import { HttpService } from "../http.service";
declare var $: any;
declare var SpriteSpin: any;
declare var baseurl: any;
declare var pushGTMlookScreen: any;
declare var Swiper: any;

@Component({
  selector: 'contentstep05',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('screenanimation', [
      state('show', style({
        height: '*', opacity: 1
      })),
      transition('* => show', animate(
        '1s ease-out', keyframes([
          style({ height: '*', opacity: 0, offset: 0 }),
          style({ height: '*', opacity: 1.0, offset: 1.0 })
        ])
      ))
    ])
  ]
})
export class Step05Component {
  title = 'app2';
  screenState: string = 'show';
  url = '';
  baseurl = '';
  results: any;

  constructor(
    private configSettings: ConfigSettings,//ConfigSettings DI
    private HttpService: HttpService
  ) {

    this.baseurl = baseurl;
    this.url = this.baseurl + configSettings.url;
  }

  ngOnInit(): void {
    // iPadの表示域に収まるようにフィッテングするため縦幅を数値で固定化
    var hsize = $(window).height() * 0.85;
    // $('contentstep04').css('height', hsize + 'px');
    // $('.leftmenu').css('height', hsize + 'px');
    //$('.maincontent').css('height', hsize + 'px');

    $(window).on('load', this.slideScreen);
  }

  slideScreen() { // 変数のスコープが違うため、定義しているプロパティが使用できないことに注意
    var swiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

  }


  // screenH登場時アニメ
  goScreenH() {
    $("#screenidH").show();
    $("#screenidV").hide();

  }

  // screenV登場時アニメ
  goScreenV() {
    $("#screenidH").hide();
    $("#screenidV").show();

  }


}
