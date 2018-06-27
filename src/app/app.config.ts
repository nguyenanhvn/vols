import { Injectable } from "@angular/core";

@Injectable()
export class ConfigSettings {

  // バックエンドからの通信URLベース
  url = 'explaindata/cars/?';

  // html取得するときのベースURL
  secondscreenbase = 'explaindata/works/';
  thirdscreenbase = 'explaindata/3rd/';

  // 何を取得すべきかフィールドを定義する設定を格納する変数
  getdata = {
    '1year': {
      'screen01': 'c_1_out',
      'screen02': 'c_1_eng',
      'screen03': 'c_1_und',
      'screen04': 'c_1_int',
      'screen05': 'c_1_load'
    },
    '2year': {
      'screen01': 'c_2_out',
      'screen02': 'c_2_eng',
      'screen03': 'c_2_und',
      'screen04': 'c_2_int',
      'screen05': 'c_2_load'
    }
  };

  // 1年点検と2年点検のクラス
  checkmarkclass = { '1year': 'maintenance_01', '2year': 'maintenance_02' };
  checkmarkstring = { '1year': '１年点検', '2year': '２年点検' };

}


