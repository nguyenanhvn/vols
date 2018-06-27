import { Component } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { ConfigSettings } from "../app.config";
import { HttpService } from "../http.service";
import { ActivatedRoute, Params } from '@angular/router';
declare var $: any;
declare var baseurl: any;
declare var pushGTMlookScreen: any;

@Component({
  selector: 'contentstep03',
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
export class Step03Component {
  title = 'app2';
  screenState: string = 'show';
  url = '';
  baseurl = '';
  results: any;
  current = '';

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

  constructor(
    private configSettings: ConfigSettings,//ConfigSettings DI
    private route: ActivatedRoute,
    private HttpService: HttpService
  ) {
    this.baseurl = baseurl;
    this.url = this.baseurl + configSettings.url;
  }

  ngOnInit(): void {
    // iPadの表示域に収まるようにフィッテングするため縦幅を数値で固定化
    // var hsize = $(window).height() * 0.85;
    // $('contentstep03').css('height', hsize + 'px');
    // $('.leftmenu').css('height', hsize + 'px');
    // $('.maincontent').css('height', hsize + 'px');

    // URLからパラメータ取り出し
    this.route.params.subscribe(params => {
      this.current = params['current'];
    });
    if (this.current == undefined) this.current = '01';

    // ボタン初期ステータスを定義
    this.readySetScreen();
    switch (this.current) {
      case '01':
        this.side01image = this.SIDE_IMAGE01.ON;
        break;
      case '02':
        this.side02image = this.SIDE_IMAGE02.ON;
        break;
      case '03':
        this.side03image = this.SIDE_IMAGE03.ON;
        break;
      case '04':
        this.side04image = this.SIDE_IMAGE04.ON;
        break;
      case '05':
        this.side05image = this.SIDE_IMAGE05.ON;
        break;
    }

    $('#screenset').val(this.current);// 変数のスコープが違うため、値の受け渡しを変更
    $(window).on('load', this.firstMovingScreen);
  }

  firstMovingScreen() { // 変数のスコープが違うため、定義しているプロパティが使用できないことに注意
    this.current = $('#screenset').val();

    switch (this.current) {
      case '01':
        $("#screenid01").show("slide");
        break;
      case '02':
        $("#screenid02").show("slide");
        break;
      case '03':
        $("#screenid03").show("slide");
        break;
      case '04':
        $("#screenid04").show("slide");
        break;
      case '05':
        $("#screenid05").show("slide");
        break;
    }

    // 画面の85％を割り出し
    var hsize = $(window).height() * 0.85;
    var wsize = $(window).width() * 0.85;

    // モーダルの宣言
    $('.area').magnificPopup({
      type: 'iframe',
      disableOn: 500, //ウィンドウ幅が500px以下だったらモーダル表示させずにリンク先へ遷移
      mainClass: 'mfp-fade',
      removalDelay: 200,
      preloader: false,
      fixedContentPos: false,
      iframe: {
        markup: '<style>.mfp-iframe-holder .mfp-content {max-width:' + wsize + 'px;height:' + hsize + 'px;overflow:auto;-webkit-overflow-scrolling:touch;display:inline-block;margin:10px;position: relative;}</style>' +
          '<style>.mfp-iframe {width:100%;height:100%;border:none;display:block;}</style>' +
          '<div class="mfp-iframe-scaler">' +
          '<div class="mfp-close"></div>' +
          '<iframe class="mfp-iframe" frameborder="0" scrolling="auto" allowfullscreen></iframe>' +
          '</div>'
      }
    });
  }

  setResponsiveMap() {
    // クリッカブルマップのレスポンシブ調整
    // $('img[usemap]').rwdImageMaps();

    // 画面の85％を割り出し
    var hsize = $(window).height() * 0.85;
    var wsize = $(window).width() * 0.85;

    // モーダルの宣言
    $('.area').magnificPopup({
      type: 'iframe',
      disableOn: 500, //ウィンドウ幅が500px以下だったらモーダル表示させずにリンク先へ遷移
      mainClass: 'mfp-fade',
      removalDelay: 200,
      preloader: false,
      fixedContentPos: false,
      iframe: {
        markup: '<style>.mfp-iframe-holder .mfp-content {max-width:' + wsize + 'px;height:' + hsize + 'px;overflow:auto;-webkit-overflow-scrolling:touch;display:inline-block;margin:10px;position: relative;}</style>' +
          '<style>.mfp-iframe {width:100%;height:100%;border:none;display:block;}</style>' +
          '<div class="mfp-iframe-scaler">' +
          '<div class="mfp-close"></div>' +
          '<iframe class="mfp-iframe" frameborder="0" scrolling="auto" allowfullscreen></iframe>' +
          '</div>'
      }
    });

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

  // 第三階層登場時アニメ
  go3rdScreen(url: string) {
    $("#layer2rd").hide();
    $("#layer3rd").show("slide");
    // 取得すべきhtmlを取り出し
    var screenurl = this.baseurl + url + '?ap=1';
    // var screenurl = 'https://dsg.vgjas.com/explaindata/3rd/16-01.html';
    console.log(screenurl);
    pushGTMlookScreen(screenurl);


    $("div#screen3rdmain div.wrap").load(screenurl, "html", this.showFunction);

  }
  showCheck() {
    $("#function").hide();
    $("#check").show();

    $("#btncheck").attr('src', 'assets/img/btn_check_on.png');
    $("#btnfunction").attr('src', 'assets/img/btn_function_off.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }
  showFunction() {
    $("#check").hide();
    $("#function").show();

    $("#btncheck").attr('src', 'assets/img/btn_check_off.png');
    $("#btnfunction").attr('src', 'assets/img/btn_function_on.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }

  go2ndScreen() {
    $("#layer3rd").hide();
    $("#layer2rd").show("slide");

    // クリッカブルマップのレスポンシブ調整
    $('img[usemap]').rwdImageMaps();


  }

  // VW指定点検画面登場時アニメ
  goVwmaintenance(url: string) {
    $("#layer2rd").hide();
    $("#layervwmaintenance").show("slide");
    // 取得すべきhtmlを取り出し
    var screenurl = this.baseurl + url + '?ap=1';
    pushGTMlookScreen(screenurl);

    $("div#screenvwmaintenance div.wrap").load(screenurl, "html");

  }

  // VW指定点検画面から戻るボタンをおした時
  go2ndScreenFromeVwmaintenance() {
    $("#layervwmaintenance").hide();
    $("#layer2rd").show("slide");

    // クリッカブルマップのレスポンシブ調整
    $('img[usemap]').rwdImageMaps();


  }

}
