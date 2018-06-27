import { Component } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { ConfigSettings } from "../app.config";
import { HttpService } from "../http.service";
declare var $: any;
declare var SpriteSpin: any;
declare var baseurl: any;
declare var pushGTMlookScreen: any;

@Component({
  selector: 'contentstep04',
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
export class Step04Component {
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

    $(window).on('load', this.hScreen);
    $(window).on('load', this.vScreen);
  }

  hScreen() { // 変数のスコープが違うため、定義しているプロパティが使用できないことに注意
    var spin = $('.spritespin');
    // these are the frame numbers that will show a detail bubble
    var details = [0, 5, 11, 17];
    // the current index in the details array
    var detailIndex = 0;

    spin.spritespin({
      source: SpriteSpin.sourceArray(baseurl + 'explaindata/content/images/3d/complete_{frame}.jpg', { frame: [1, 48], digits: 2 }),
      // width and height of the display
      width: 751,
      height: 434,
      // the number of lanes (vertical angles)
      lanes: 1,
      // the number of frames per lane (per vertical angle)
      frames: 47,
      // interaction sensitivity (and direction) modifier for horizontal movement
      sense: 1,
      // interaction sensitivity (and direction) modifier for vertical movement
      //   senseLane: -2,

      // the initial lane number
      //   lane: 6,
      // the initial frame number (within the lane)
      frame: 36,
      // disable autostart of the animation
      animate: false,
      mods: [
        'move',
        // enable zoom module
        // toggle zoom with double click or use the API object
        'zoom',
        // display module
        '360'
      ]

    });


    // get the api object. This is used to trigger animation to play up to a specific frame
    var api = spin.spritespin("api");
    spin.bind("onFrame", function () {
      var data = api.data;
      console.log(data.frame);
    });

    $('#jszoom').click(function (e: any) {
      e.preventDefault();
      console.log('ok');
      // もしチェックが入っていたら
      if ($('input[name="jszoom"]').prop('checked')) {
        // チェックを外す
        $('input[name="jszoom"]').prop('checked', false);
        // もしチェックが外れていたら
      } else {
        // チェックを入れる
        $('input[name="jszoom"]').prop('checked', true);
      }
      api.toggleZoom();
    });

  }

  vScreen() { // 変数のスコープが違うため、定義しているプロパティが使用できないことに注意
    var spin = $('.spritespinV');
    // these are the frame numbers that will show a detail bubble
    var details = [0, 5, 11, 17];
    // the current index in the details array
    var detailIndex = 0;

    spin.spritespin({
      source: SpriteSpin.sourceArray(baseurl + 'explaindata/content/images/3d/complete_1{lane}.jpg', { lane: [1, 10], digits: 2 }),
      // width and height of the display
      width: 751,
      height: 434,
      // the number of lanes (vertical angles)
      lanes: 10,
      // the number of frames per lane (per vertical angle)
      frames: 1,
      // interaction sensitivity (and direction) modifier for horizontal movement
      sense: -1,
      // interaction sensitivity (and direction) modifier for vertical movement
      senseLane: -2,

      // the initial lane number
      lane: 4,
      // the initial frame number (within the lane)
      frame: 0,
      // disable autostart of the animation
      animate: false,
      mods: [
        'move',
        // enable zoom module
        // toggle zoom with double click or use the API object
        'zoom',
        // display module
        '360'
      ]

    });


    // get the api object. This is used to trigger animation to play up to a specific frame
    var api = spin.spritespin("api");
    spin.bind("onFrame", function () {
      var data = api.data;
      console.log(data.frame);
    });

    $('#jszoomV').click(function (e: any) {
      e.preventDefault();
      console.log('ok');

      // もしチェックが入っていたら
      if ($('input[name="jszoomV"]').prop('checked')) {
        // チェックを外す
        $('input[name="jszoomV"]').prop('checked', false);
        // もしチェックが外れていたら
      } else {
        // チェックを入れる
        $('input[name="jszoomV"]').prop('checked', true);
      }
      api.toggleZoom();
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
