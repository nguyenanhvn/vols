import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfigSettings } from "../app.config";
import { HttpService } from "../http.service";
declare var $: any;
declare var baseurl: any;
declare var pushGTMlookScreen: any;

@Component({
  selector: 'contentstep02',
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
export class Step02Component {
  title = 'app2';
  screenState: string = 'show';

  // URLから取得したパラメータを格納する変数
  selectedCar: string = '';
  selectedModel: string = '';
  selectedCheckType: string = '';

  // バックエンドからの通信URL
  url = '';
  baseurl = '';

  // バックエンドから取得したデータを格納する変数
  results: any;

  // 何を取得すべきかフィールドを定義する設定を格納する変数
  getdatafeild = {};

  // html取得するときのベースURL
  secondscreenbase = '';

  // ボタンイメージのON/OFFの定義
  SIDE_IMAGE01 = { ON: 'assets/img/lmenu01_on.png', OFF: 'assets/img/lmenu01_off.png' };
  SIDE_IMAGE02 = { ON: 'assets/img/lmenu02_on.png', OFF: 'assets/img/lmenu02_off.png' };
  SIDE_IMAGE03 = { ON: 'assets/img/lmenu03_on.png', OFF: 'assets/img/lmenu03_off.png' };
  SIDE_IMAGE04 = { ON: 'assets/img/lmenu04_on.png', OFF: 'assets/img/lmenu04_off.png' };
  SIDE_IMAGE05 = { ON: 'assets/img/lmenu05_on.png', OFF: 'assets/img/lmenu05_off.png' };

  // ボタンのON/OFFのステータス
  side01image: string;
  side02image: string;
  side03image: string;
  side04image: string;
  side05image: string;

  // 1年点検と2年点検のクラス
  checkmarkclass = {};
  checkmarkstring = {};
  nowcheckmarkclass = '';
  nowcheckmarkstring = '';

  // スワイプする時の定義(現在は未使用)
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight', UP: 'swipeup', DOWN: 'swipedown' };

  constructor(
    private configSettings: ConfigSettings,//ConfigSettings DI
    private route: ActivatedRoute,
    private HttpService: HttpService
  ) {
    // 設定ファイルからデータを取り込み
    this.baseurl = baseurl;
    this.url = this.baseurl + configSettings.url;
    this.getdatafeild = configSettings.getdata;
    this.secondscreenbase = this.baseurl + configSettings.secondscreenbase;
    this.checkmarkclass = configSettings.checkmarkclass;
    this.checkmarkstring = configSettings.checkmarkstring;
    console.log(this.baseurl);
    console.log(this.secondscreenbase);

    // ボタン初期ステータスを定義
    this.readySetScreen();
    this.side01image = this.SIDE_IMAGE01.ON;
    $("#screenid01").show("slide");

  }

  ngOnInit() {
    // iPadの表示域に収まるようにフィッテングするため縦幅を数値で固定化
    // var hsize = $(window).height() * 0.85;
    // $('contentstep02').css('height', hsize + 'px');
    // $('.leftmenu').css('height', hsize + 'px');
    // $('.leftmenu3rd').css('height', hsize + 'px');
    // $('.maincontent').css('height', hsize + 'px');

    // URLからパラメータ取り出し
    this.route.params.subscribe(params => {
      this.selectedCheckType = params['type'];
      this.selectedCar = params['car'];
      this.selectedModel = params['model'];
    });

    // 1年点検と2年点検のクラス
    this.nowcheckmarkclass = this.checkmarkclass[this.selectedCheckType];
    this.nowcheckmarkstring = this.checkmarkstring[this.selectedCheckType];

    // バックエンド通信用URLを組み立て
    var geturl = this.url + 'model=' + this.selectedCar + '&modelcode=' + this.selectedModel;

    // バックエンドに通信
    this.HttpService.requestGetData(geturl).subscribe(
      data => {
        // Read the result field from the JSON response.
        // console.log(data);
        this.results = data;

        // 取得すべきhtmlを取り出し
        var screen01url = this.secondscreenbase + this.results[0][this.getdatafeild[this.selectedCheckType]['screen01']] + '.html';
        var screen02url = this.secondscreenbase + this.results[0][this.getdatafeild[this.selectedCheckType]['screen02']] + '.html';
        var screen03url = this.secondscreenbase + this.results[0][this.getdatafeild[this.selectedCheckType]['screen03']] + '.html';
        var screen04url = this.secondscreenbase + this.results[0][this.getdatafeild[this.selectedCheckType]['screen04']] + '.html';
        var screen05url = this.secondscreenbase + this.results[0][this.getdatafeild[this.selectedCheckType]['screen05']] + '.html';

        // htmlを取得して指定場所に描画
        $("div#screenid01 div.wrap").load(screen01url, "html", this.setResponsiveMap);
        $("div#screenid02 div.wrap").load(screen02url, "html", this.setResponsiveMap);
        $("div#screenid03 div.wrap").load(screen03url, "html", this.setResponsiveMap);
        $("div#screenid04 div.wrap").load(screen04url, "html", this.setResponsiveMap);
        // $("div#screenid05 div.wrap").load(screen05url);

        return true;
      },
      err => {
        console.log('Wrong Response!');
        return false;
      }
    );


  }

  setResponsiveMap() {
    // クリッカブルマップのレスポンシブ調整
    $('img[usemap]').rwdImageMaps();

    // 画面の85％を割り出し
    var hsize = $(window).innerHeight() * 0.85;
    var wsize = $(window).width() * 0.85;
    console.log(hsize);

    // // モーダルの宣言
    // $('.area').magnificPopup({
    //   type: 'iframe',
    //   disableOn: 500, //ウィンドウ幅が500px以下だったらモーダル表示させずにリンク先へ遷移
    //   mainClass: 'mfp-fade',
    //   removalDelay: 200,
    //   preloader: false,
    //   fixedContentPos: false,
    //   iframe: {
    //     markup: '<style>.mfp-iframe-holder .mfp-content {max-width:' + wsize + 'px;height:' + hsize + 'px;overflow:auto;-webkit-overflow-scrolling:touch;display:inline-block;margin:10px;position: relative;}</style>' +
    //       '<style>.mfp-iframe {width:100%;height:100%;border:none;display:block;}</style>' +
    //       '<div class="mfp-iframe-scaler">' +
    //       '<div class="mfp-close"></div>' +
    //       '<iframe class="mfp-iframe" frameborder="0" scrolling="auto" allowfullscreen></iframe>' +
    //       '</div>'
    //   }
    // });

  }

  readySetScreen() {
    $("#screenid01").hide();
    $("#screenid02").hide();
    $("#screenid03").hide();
    $("#screenid04").hide();
    $("#screenid05").hide();

    this.side01image = this.SIDE_IMAGE01.OFF;
    this.side02image = this.SIDE_IMAGE02.OFF;
    this.side03image = this.SIDE_IMAGE03.OFF;
    this.side04image = this.SIDE_IMAGE04.OFF;
    this.side05image = this.SIDE_IMAGE05.OFF;
  }

  // screen01登場時アニメ
  goScreen01() {
    this.readySetScreen();
    $("#screenid01").show("slide");
    this.side01image = this.SIDE_IMAGE01.ON;

    this.setResponsiveMap();

  }

  // screen02登場時アニメ
  goScreen02() {
    this.readySetScreen();
    $("#screenid02").show("slide");
    this.side02image = this.SIDE_IMAGE02.ON;

    this.setResponsiveMap();

  }

  // screen03登場時アニメ
  goScreen03() {
    this.readySetScreen();
    $("#screenid03").show("slide");
    this.side03image = this.SIDE_IMAGE03.ON;

    this.setResponsiveMap();
  }

  // screen04登場時アニメ
  goScreen04() {
    this.readySetScreen();
    $("#screenid04").show("slide");
    this.side04image = this.SIDE_IMAGE04.ON;

    this.setResponsiveMap();
  }

  // screen05登場時アニメ
  goScreen05() {
    this.readySetScreen();
    $("#screenid05").show("slide");

    this.side05image = this.SIDE_IMAGE05.ON;

    this.setResponsiveMap();
  }




}
