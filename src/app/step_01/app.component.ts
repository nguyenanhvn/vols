import { Component, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { ConfigSettings } from "../app.config";
import { HttpService } from "../http.service";
import { ActivatedRoute, Params } from '@angular/router';
declare var $: any;
declare var baseurl: any;
declare var pushGTMlookScreen: any;

@Component({
  selector: 'content',
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
export class Step01Component {
  title = 'app1';
  screenState: string = 'show';
  current = '';
  alreadychange = 0;

  // バックエンドからの通信URL
  url = '';
  baseurl = '';

  // バックエンドから取得したデータを格納する変数
  results: any;

  // 車種を選択した時のステータス
  selectedCar: string = '';

  // モデルを選択した時のステータス
  selectedModel: string = '';
  selectedVwMainte: string = '';

  // html取得するときのベースURL
  thirdscreenbase = '';

  // ボタンイメージのON/OFFの定義
  SIDE_IMAGE01 = { ON: 'assets/img/side01_on.png', OFF: 'assets/img/side01_off.png' };
  SIDE_IMAGE02 = { ON: 'assets/img/side02_on.png', OFF: 'assets/img/side02_off.png' };

  // ボタンのON/OFFのステータス
  side01image: string;
  side02image: string;

  // ラインナップ画面の表示ステータス
  lineupState: string = 'hide';

  // その他画面の表示画面
  otherscreensw: string = '01';

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
    this.thirdscreenbase = this.baseurl + configSettings.thirdscreenbase;
    console.log(this.baseurl);
  }

  ngOnInit(): void {

    // iPadの表示域に収まるようにフィッテングするため縦幅を数値で固定化
    // var hsize = $(window).height() * 0.85;
    // $('content').css('height', hsize + 'px');
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
    }

    $('#screenset').val(this.current);// 変数のスコープが違うため、値の受け渡しを変更
    $(window).on('load', this.firstMovingScreen);
  }

  setResponsiveMap() {
    // クリッカブルマップのレスポンシブ調整
    $('img[usemap]').rwdImageMaps();

    // 画面の85％を割り出し
    var hsize = $(window).height() * 0.85;
    var wsize = $(window).width() * 0.85;

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

    this.side01image = this.SIDE_IMAGE01.OFF;
    this.side02image = this.SIDE_IMAGE02.OFF;
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
    }

    // クリッカブルマップのレスポンシブ調整
    $('img[usemap]').rwdImageMaps();

    // 画面の85％を割り出し
    var hsize = $(window).height() * 0.85;
    var wsize = $(window).width() * 0.85;

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

  // screen01登場時アニメ
  goScreen01() {
    console.log('01');

    //$(".screen01").height("80vh");
    $("#screenid01").show("slide");
    $("#screenid02").hide("slide");

    this.side01image = this.SIDE_IMAGE01.ON;
    this.side02image = this.SIDE_IMAGE02.OFF;

    this.setResponsiveMap();

  }

  // screen02登場時アニメ
  goScreen02() {
    console.log('02');

    //$(".screen01").height(0);
    $("#screenid01").hide("slide");
    $("#screenid02").show("slide");

    this.side01image = this.SIDE_IMAGE01.OFF;
    this.side02image = this.SIDE_IMAGE02.ON;

    this.setResponsiveMap();

  }

  // ラインナップ登場時アニメ
  goLineup() {
    console.log('lineup');
    $("#checkinlineup").find('li').fitText(1.1, { minFontSize: '8px', maxFontSize: '10px' });
    $('#lineupbtn_base0').hide();
    $('#lineupbtn_base').show();

    // チェックを外す
    $('input[name="lineup"]').prop('checked', true);

    $("#slide_base").css('left', '0px');
    $("#checkinlineup").show("slide");

    this.setResponsiveMap();
  }

  // ラインナップ退場時時アニメ
  hideLineup() {
    console.log('hide_lineup');
    $('#lineupbtn_base1').hide();
    $('#lineupbtn_base0').show();

    // チェックを外す
    $('input[name="lineup"]').prop('checked', false);

    $("#checkinlineup").hide("slide");
    $("#slide_base").css('left', '-10000px');

    this.setResponsiveMap();
  }

  // 車種選択をタップした時
  tapedCar(car: string) {

    // バックエンド通信用URLを組み立て
    var geturl = this.url + 'model=' + car;

    // 表示を変化させるidを指定するため受取データを加工
    var change_element = car.replace(/ /g, '');
    change_element = change_element.replace('!', '');

    // タップしたデータを変数に格納
    this.selectedCar = car;
    this.selectedModel = '';
    this.selectedVwMainte = '';

    // 選択した場所の表示を変化させる
    $('.selectcar').removeClass('active');
    $('#car-' + change_element).addClass('active');

    // バックエンドに通信
    this.HttpService.requestGetData(geturl).subscribe(
      data => {
        // Read the result field from the JSON response.
        console.log(data);
        this.results = data;
        return true;
      },
      err => {
        console.log('Wrong Response!');
        return false;
      }
    );

  }

  // モデル選択をタップした時
  tapedmodel(model: string, vwmainte: string) {
    // タップしたデータを変数に格納
    this.selectedModel = model;
    this.selectedVwMainte = this.thirdscreenbase + vwmainte + '.html';
    console.log(this.selectedVwMainte);

    // 選択した場所の表示を変化させる
    $('.selectmodel').removeClass('active');
    $('#model-' + model).addClass('active');

    this.alreadychange = 0;

  }

  // 画面に変化があるたびに呼び出される
  ngAfterViewChecked(): void {
    if ($.fn.rwdImageMaps != undefined) { // 初回時は定義されていないので機能しないようにする
      if (this.alreadychange == 0) {
        this.setResponsiveMap();
        this.alreadychange = 1;
      }
    }
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

  // 日常点検登場時アニメ
  gomaintenacecreen() {
    $("#layer2rd").hide();
    $("#layermaintenance").show("slide");
    // 取得すべきhtmlを取り出し
    var screenurl = this.baseurl + 'explaindata/modal/self_maintenance.html?ap=1';
    pushGTMlookScreen(screenurl);

    $("div#screenmaintenance div.wrap").load(screenurl, "html", this.firstMaintenancescreen);

  }

  // 日常点検のボタンの状態をすべてoff
  changeMaintenanceBtnOff() {
    $("#maintenancescreen01").hide();
    $("#maintenancescreen02").hide();
    $("#maintenancescreen03").hide();
    $("#maintenancescreen04").hide();

    $("#btnmaintenancescreen01").attr('src', 'assets/img/btn_cation_off.png');
    $("#btnmaintenancescreen02").attr('src', 'assets/img/btn_engine_off.png');
    $("#btnmaintenancescreen03").attr('src', 'assets/img/btn_car_out_off.png');
    $("#btnmaintenancescreen04").attr('src', 'assets/img/btn_driving_seat_off.png');

  }

  // 日常点検の初期状態の画面表示
  firstMaintenancescreen() {
    $("#maintenancescreen01").show();
    $("#maintenancescreen02").hide();
    $("#maintenancescreen03").hide();
    $("#maintenancescreen04").hide();

    $("#btnmaintenancescreen01").attr('src', 'assets/img/btn_cation_on.png');
    $("#btnmaintenancescreen02").attr('src', 'assets/img/btn_engine_off.png');
    $("#btnmaintenancescreen03").attr('src', 'assets/img/btn_car_out_off.png');
    $("#btnmaintenancescreen04").attr('src', 'assets/img/btn_driving_seat_off.png');

  }

  // 日常点検の画面1描画
  goMaintenanceScreen01() {
    this.changeMaintenanceBtnOff();
    $("#maintenancescreen01").show();
    $("#btnmaintenancescreen01").attr('src', 'assets/img/btn_cation_on.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }

  // 日常点検の画面2描画
  goMaintenanceScreen02() {
    this.changeMaintenanceBtnOff();
    $("#maintenancescreen02").show();
    $("#btnmaintenancescreen02").attr('src', 'assets/img/btn_engine_on.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }

  // 日常点検の画面3描画
  goMaintenanceScreen03() {
    this.changeMaintenanceBtnOff();
    $("#maintenancescreen03").show();
    $("#btnmaintenancescreen03").attr('src', 'assets/img/btn_car_out_on.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }

  // 日常点検の画面4描画
  goMaintenanceScreen04() {
    this.changeMaintenanceBtnOff();
    $("#maintenancescreen04").show();
    $("#btnmaintenancescreen04").attr('src', 'assets/img/btn_driving_seat_on.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }

  // 日常点検から戻るボタンをおした時
  go2ndScreenFromeMaintenance() {
    $("#layermaintenance").hide();
    $("#layer2rd").show("slide");

    // クリッカブルマップのレスポンシブ調整
    $('img[usemap]').rwdImageMaps();

    // 選択した車種のリセット
    this.resetSelectedCar();

  }

  // ホイールアライメント点検登場時アニメ
  goWheel() {
    $("#layer2rd").hide();
    $("#layerwheel").show("slide");
    // 取得すべきhtmlを取り出し
    var screenurl = this.baseurl + 'explaindata/modal/wa_maintenance.html?ap=1';
    pushGTMlookScreen(screenurl);

    $("div#screenwheel div.wrap").load(screenurl, "html", this.firstWheelscreen);

  }

  // ホイールアライメント点検のボタンの状態をすべてoff
  changeWheelBtnOff() {
    $("#wheelscreen01").hide();
    $("#wheelscreen02").hide();

    $("#btnwheelscreen01").attr('src', 'assets/img/btn_alignment_off.png');
    $("#btnwheelscreen02").attr('src', 'assets/img/btn_vw_tool_off.png');

  }

  // ホイールアライメント点検の初期状態の画面表示
  firstWheelscreen() {
    $("#wheelscreen01").show();
    $("#wheelscreen02").hide();

    $("#btnwheelscreen01").attr('src', 'assets/img/btn_alignment_on.png');
    $("#btnwheelscreen02").attr('src', 'assets/img/btn_vw_tool_off.png');

  }

  // ホイールアライメント点検の画面1描画
  goWheelScreen01() {
    this.changeWheelBtnOff();
    $("#wheelscreen01").show();
    $("#btnwheelscreen01").attr('src', 'assets/img/btn_alignment_on.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }

  // ホイールアライメント点検の画面2描画
  goWheelScreen02() {
    this.changeWheelBtnOff();
    $("#wheelscreen02").show();
    $("#btnwheelscreen02").attr('src', 'assets/img/btn_vw_tool_on.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }

  // ホイールアライメント点検から戻るボタンをおした時
  go2ndScreenFromeWheel() {
    $("#layerwheel").hide();
    $("#layer2rd").show("slide");

    // クリッカブルマップのレスポンシブ調整
    $('img[usemap]').rwdImageMaps();

    // 選択した車種のリセット
    this.resetSelectedCar();

  }

  // VW指定点検画面登場時アニメ
  goVwmaintenance(url: string) {
    $("#layer2rd").hide();
    $("#layervwmaintenance").show("slide");
    // 取得すべきhtmlを取り出し
    // if (url != '') {
    //   var screenurl = this.baseurl + url + '?ap=1';
    // } else {
    //   var screenurl = this.selectedVwMainte + '?ap=1';
    // }
    var screenurl = this.baseurl + 'explaindata/3rd/petrol-MT-all.html?ap=1';
    pushGTMlookScreen(screenurl);

    $("div#screenvwmaintenance div.wrap").load(screenurl, "html");

  }

  // VW指定点検画面から戻るボタンをおした時
  go2ndScreenFromeVwmaintenance() {
    $("#layervwmaintenance").hide();
    $("#layer2rd").show("slide");

    // クリッカブルマップのレスポンシブ調整
    $('img[usemap]').rwdImageMaps();

    // 選択した車種のリセット
    this.resetSelectedCar();
  }

  // 選択した車種のリセット
  //(本来は第二階層に行ったときも選択した車種を保持したいらしいが
  //ソレは第二フェイズで対応するためここで現在の挙動に合わせるために暫定対応を行う)
  resetSelectedCar() {
    $('.selectcar').removeClass('active');
    $('.selectmodel').removeClass('active');
    this.results = [];
    this.selectedCar = '';
    this.selectedModel = '';
    this.selectedVwMainte = '';

  }

  // その他画面登場時アニメ
  goOthers(sw: string) {
    this.otherscreensw = sw;
    $("#layer2rd").hide();
    $("#layerothers").show("slide");
    // 取得すべきhtmlを取り出し
    var screenurl = this.baseurl + 'explaindata/modal/others.html?ap=1';
    pushGTMlookScreen(screenurl);

    $('#otherscreenset').val(this.otherscreensw);// 変数のスコープが違うため、値の受け渡しを変更
    $("div#screenothers div.wrap").load(screenurl, "html", this.firstOthersscreen);

  }

  // その他画面のボタンの状態をすべてoff
  changeOthersBtnOff() {
    $("#othersscreen01").hide();
    $("#othersscreen02").hide();
    $("#othersscreen03").hide();

    $("#btnothersscreen01").attr('src', 'assets/img/btn_tsi_engine_off.png');
    $("#btnothersscreen02").attr('src', 'assets/img/btn_dsg_image_off.png');
    $("#btnothersscreen03").attr('src', 'assets/img/btn_cation_lamp_off.png');

  }

  // その他画面の初期状態の画面表示
  firstOthersscreen() {
    $("#othersscreen01").hide();
    $("#othersscreen02").hide();
    $("#othersscreen03").hide();

    $("#btnothersscreen01").attr('src', 'assets/img/btn_tsi_engine_off.png');
    $("#btnothersscreen02").attr('src', 'assets/img/btn_dsg_image_off.png');
    $("#btnothersscreen03").attr('src', 'assets/img/btn_cation_lamp_off.png');

    this.otherscreensw = $('#otherscreenset').val();

    switch (this.otherscreensw) {
      case '01':
        $("#othersscreen01").show();
        $("#btnothersscreen01").attr('src', 'assets/img/btn_tsi_engine_on.png');
        break;
      case '02':
        $("#othersscreen02").show();
        $("#btnothersscreen02").attr('src', 'assets/img/btn_dsg_image_on.png');
        break;
      case '03':
        $("#othersscreen03").show();
        $("#btnothersscreen03").attr('src', 'assets/img/btn_cation_lamp_on.png');
        break;
    }

  }

  // その他画面の画面1描画
  goOthersScreen01() {
    this.changeOthersBtnOff();
    $("#othersscreen01").show();
    $("#btnothersscreen01").attr('src', 'assets/img/btn_tsi_engine_on.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }

  // その他画面の画面2描画
  goOthersScreen02() {
    this.changeOthersBtnOff();
    $("#othersscreen02").show();
    $("#btnothersscreen02").attr('src', 'assets/img/btn_dsg_image_on.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }

  // その他画面の画面3描画
  goOthersScreen03() {
    this.changeOthersBtnOff();
    $("#othersscreen03").show();
    $("#btnothersscreen03").attr('src', 'assets/img/btn_cation_lamp_on.png');

    // スクロールしてもトップに戻る
    $(window).scrollTop(0);
  }

  // その他画面から戻るボタンをおした時
  go2ndScreenFromeothers() {
    $("#layerothers").hide();
    $("#layer2rd").show("slide");

    // クリッカブルマップのレスポンシブ調整
    $('img[usemap]').rwdImageMaps();

    // 選択した車種のリセット
    this.resetSelectedCar();

  }
}
