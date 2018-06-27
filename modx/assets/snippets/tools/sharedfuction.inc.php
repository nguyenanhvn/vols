<?php
// セキュリティトークン用文字列
	define('UUIDSESSSEED' , 'shizuokashohi');

	global $redirectOfError;
	$redirectOfError = 0;

	global $past_day;
	global $feature_day;

// 過去日付を文字列で設定
	$past_day    = "2014/01/01";

// 未来日付を文字列で設定
	$feature_day    = "2100/01/01";

//中部地域
	global $area_each_city_for_search;
	$area_each_city_for_search = array();
	$area_each_city_for_search[1][0] = '静岡市';
	$area_each_city_for_search[1][1] = '島田市';
	$area_each_city_for_search[1][2] = '焼津市';
	$area_each_city_for_search[1][3] = '藤枝市';
	$area_each_city_for_search[1][4] = '牧之原市';
	$area_each_city_for_search[1][5] = '吉田町';
	$area_each_city_for_search[1][6] = '川根本町';

//東部地域
	$area_each_city_for_search[2][ 0] = '沼津市';
	$area_each_city_for_search[2][ 1] = '熱海市';
	$area_each_city_for_search[2][ 2] = '三島市';
	$area_each_city_for_search[2][ 3] = '富士宮市';
	$area_each_city_for_search[2][ 4] = '伊東市';
	$area_each_city_for_search[2][ 5] = '富士市';
	$area_each_city_for_search[2][ 6] = '御殿場市';
	$area_each_city_for_search[2][ 7] = '裾野市';
	$area_each_city_for_search[2][ 8] = '伊豆市';
	$area_each_city_for_search[2][ 9] = '伊豆の国市';
	$area_each_city_for_search[2][10] = '函南町';
	$area_each_city_for_search[2][11] = '清水町';
	$area_each_city_for_search[2][12] = '長泉町';
	$area_each_city_for_search[2][13] = '小山町';
	$area_each_city_for_search[2][14] = '下田市';
	$area_each_city_for_search[2][15] = '東伊豆町';
	$area_each_city_for_search[2][16] = '河津町';
	$area_each_city_for_search[2][17] = '南伊豆町';
	$area_each_city_for_search[2][18] = '松崎町';
	$area_each_city_for_search[2][19] = '西伊豆町';

//西部地域
	$area_each_city_for_search[3][0] = '浜松市';
	$area_each_city_for_search[3][1] = '磐田市';
	$area_each_city_for_search[3][2] = '掛川市';
	$area_each_city_for_search[3][3] = '袋井市';
	$area_each_city_for_search[3][4] = '湖西市';
	$area_each_city_for_search[3][5] = '御前崎市';
	$area_each_city_for_search[3][6] = '菊川市';
	$area_each_city_for_search[3][7] = '森町';

	global $lang_suffix;
	$lang_suffix = array();
	$lang_suffix[1] = 'jp';
	$lang_suffix[2] = 'en';
	$lang_suffix[3] = 'tc';
	$lang_suffix[4] = 'sc';
	$lang_suffix[5] = 'ko';
	$lang_suffix[6] = 'po';

	global $search_meter;
	//20m==1||100m==2||500m==3||2km==4||5km==5
	$search_meter = array(
		1 => 0.02,
		2 => 0.1,
		3 => 0.5,
		4 => 2,
		5 => 5,
	);

	global $machipo_url;
	global $machipo_useragent;
	$machipo_url = 'https://machipo.jp/api/v223/search.json';
	$machipo_useragent = 'fujisan-app-6f9b214b7663bcf221d2e02df399010c';


// ----------------------------------------------------------------
// ファンクション関連
// 一番上の親IDをゲット
	function getUltimateParentForMuntiPurpose( $id , $top = 0 , $topLevel = 0 ) {
		global $modx;

		if ($id && $id != $top) {
			$pid= $id;
			if (!$topLevel || count($modx->getParentIds($id)) >= $topLevel) {
				while ($parentIds= $modx->getParentIds($id, 1)) {
					$pid= array_pop($parentIds);
					if ($pid == $top) {
						break;
					}
					$id= $pid;
					if ($topLevel && count($modx->getParentIds($id)) < $topLevel) {
						break;
					}
				}
			}
		}
		return $id;

	}

// 当該のテンプレートに所属するページIDを権限を含みゲット
	function getMakerPageIdWithDocGrp( $templateChildId ) {
		global $modx;
		if ($templateChildId == 3 ) { // 教材
			$templateId= 6;
		} else 	if ($templateChildId == 4 ) { // イベント
			$templateId= 5;
		} else {
			$templateId= $templateChildId;
		}

		if ($aDocgrp= $modx->getUserDocGroups()) {
			$docgrp= implode(",", $aDocgrp);
		} else {
			$docgrp = '';
		}

		// コンテンツテーブル
		$content_table_name = $modx->getFullTableName( 'site_content' );

		// ドキュメントグループテーブル
		$document_groups_table_name = $modx->getFullTableName('document_groups');


		// SQL組み立て
		$sql  = "SELECT DISTINCT ";
		$sql .= "contents.id ";
		$sql .= "FROM ";
		$sql .= $content_table_name       . " AS contents ";
		if ( $docgrp != "" ) {
			$sql .= ", ";
			$sql .= $document_groups_table_name . " AS docgrp ";
		}
		$sql .= "WHERE ";
		$sql .= " contents.published = 1 ";
		$sql .= " AND ";
		$sql .= " contents.deleted = 0 ";
		$sql .= " AND ";
		$sql .= " contents.template = ".$templateId." ";
		if ( $docgrp != "" ) {
			$sql .= " AND ";
			$sql .= "contents.id = docgrp.document ";
			$sql .= " AND ";
			$sql .= " docgrp.document_group IN (".$docgrp.") ";
		}

		$rs= $modx->dbQuery($sql);
		$rowCount= $modx->recordCount($rs);
		$contentid = '';
		if ($rowCount > 0) {
			for ($i= 0; $i < $rowCount; $i++) {
				$row= $modx->fetchRow($rs);
				$contentid= $row['id'];
			}
		}

		if ($rowCount > 1) {
			if ($templateChildId == 3 ) { // 教材
				$contentid= 10;
			} else if ($templateChildId == 4 ) { // イベント
				$contentid= 11;
			} else {
				$contentid= 1;
			}
		}

		return $contentid;
	}

// マーカーIDをゲット
	function getMakerPageIdForMuntiPurpose( $contents_id , $marker_string , $published = 1 ) {
		global $modx;
		$maker_id = $contents_id;
		$a_set = $modx->getChildIds( $contents_id , 1);

		$grand_child = $modx->getDocuments( $a_set , $published , 0 , 'pagetitle,id,alias' , ' hidemenu = 0 ' );
		if ( count ( $grand_child ) != 0 ) {
			$i_count_max = count ( $grand_child );
			for ( $i_count = 0 ; $i_count < $i_count_max ; $i_count ++ ) {
				if ( $grand_child [ $i_count ][ 'pagetitle' ] == $marker_string ) { // マーカーの文字列と一致した場合
					$maker_id = $grand_child [ $i_count ][ 'id' ]; // マーカーIDをセット
				}
			}
		}

		// マーカーIDをセット
		return ($maker_id);

	}

// マーカー子IDをゲット
	function getMakerPageChildsForMuntiPurpose( $contents_id , $marker_string ) {
		global $modx;
		$aMarkerStrings = explode(',', $marker_string);
		$maker_id = $contents_id;
		$a_set = $modx->getChildIds( $contents_id , 1);

		$grand_child = $modx->getDocuments( $a_set , 1 , 0 , 'pagetitle,id,alias' , ' hidemenu = 0 ' );
		if ( count ( $grand_child ) != 0 ) {
			$i_count_max = count ( $grand_child );
			for ( $i_count = 0 ; $i_count < $i_count_max ; $i_count ++ ) {
				if (in_array($grand_child[$i_count]['pagetitle'] , $aMarkerStrings)) { // マーカーの文字列と一致した場合
					$maker_id = $grand_child [ $i_count ][ 'id' ]; // マーカーIDをセット
				}
			}
		}

		// マーカーIDをもとにマーカーIDの子IDをセット
		$a_result_id = $modx->getChildIds( $maker_id , 1);
		$s_result_id = implode( ',' , $a_result_id );
		return ($s_result_id);

	}

	function searchFolder($contentIds,$marker_string) {
		global $modx;
		$in = implode("','", $contentIds);
		$in = preg_replace('/^|$/', "'", $in);

		$inM = implode("','", explode(',', $marker_string));
		$inM = preg_replace('/^|$/', "'", $inM);

		// テーブル
		$content_table_name = $modx->getFullTableName( 'site_content' );

		// 現在の登録状況をゲット
		// ----------------------------------------------------------------
		// SQL文構築
		$sql_string_where  = "";
		$sql_string_where .= " parent IN (".$in.") ";
		$sql_string_where .= " AND ";
		$sql_string_where .= " pagetitle IN (".$inM.") ";

		// SQL発行
		$result = $modx->db->select('*', $content_table_name , $sql_string_where);

		// データ取り出し
		$aResultData = array();
		$exit_flag  = 0;
		if( $modx->db->getRecordCount( $result ) >= 1 ) {
			while( $row = $modx->db->getRow( $result ) ) {
				$aResultData[] = $row['id'];
			}
		}
		return $aResultData;
	}

// テンプレート変数選択値取得
	function getSelectableValueByTemplateVar($tmpId,$switch = 1) {
		global $modx;
		global $const_area_string;

		// テンプレート変数テーブル
		$site_tmplvars_table_name = $modx->getFullTableName('site_tmplvars');

		// 現在の登録状況をゲット
		// ----------------------------------------------------------------
		// SQL文構築
		$sql_string_where  = "";
		$sql_string_where .= " id='".$tmpId."' ";

		// SQL発行
		$result = $modx->db->select('*', $site_tmplvars_table_name , $sql_string_where);

		// データ取り出し
		$aResultData = array();
		$row = $modx->db->getRow($result);
		if (isset($row['elements'])) {
			$aList = explode('||', $row['elements']);
			for ($i = 0; $i < count($aList); $i++) {
				if (mb_strpos($aList[$i], '==') !== FALSE) {
					$splitData = explode('==', $aList[$i]);
					$oneData = $splitData[$switch];
				} else {
					$oneData = $aList[$i];
				}
				$aResultData[] = $oneData;
				next($aList);
			}

		}

		return $aResultData;

	}


// 管理画面が使用している可能性があり。げずれない・・・山口さんどうですか?
// はじまり
	function makeSqlInSrtringByContentIds($contentIds) {
		if (count($contentIds) == 0) return;
		$in = implode("','", $contentIds);
		$in = preg_replace('/^|$/', "'", $in);
		$resultString = " contents.parent IN (" . $in . ")";
		return $resultString;
	}

	function buildSqlByArea($area,$marker_string='施工例') {
		$contentIds = searchCompanyByArea($area);
		$contentIds = searchFolder($contentIds,$marker_string);
		return makeSqlInSrtringByContentIds($contentIds);
	}

	function buildSqlByEnshuu($marker_string='施工例') {
		$contentIds = searchCompanyByEnshuu();
		$contentIds = searchFolder($contentIds,$marker_string);
		return makeSqlInSrtringByContentIds($contentIds);
	}
// おわり
// 管理画面が使用している可能性があり。げずれない・・・山口さんどうですか?

	function getYoubiForMuntiPurpose($date){
		$sday = strtotime($date);
		$res = date("w", $sday);
		$day = array("日", "月", "火", "水", "木", "金", "土");
		return $day[$res];
	}

	function strAddrToLatLng( $strAddr ) {
		$strRes = file_get_contents(
			'http://maps.google.com/maps/api/geocode/json'
			. '?address=' . urlencode( mb_convert_encoding( $strAddr, 'UTF-8' ) )
			. '&sensor=false'
		);
		$aryGeo = json_decode( $strRes, TRUE );
		if ( !isset( $aryGeo['results'][0] ) ) return '';

		$strLat = (string)$aryGeo['results'][0]['geometry']['location']['lat'];
		$strLng = (string)$aryGeo['results'][0]['geometry']['location']['lng'];
		return $strLat . ',' . $strLng;
	}

	function buildIteratinString($format,$aData) {
		global $modx;
		$outputParts = '';

		for ($i = 0; $i < count($aData); $i++) {
			$trans = array();
			$trans['CNT'] = $i;
			$trans['STRING'] = $aData[key($aData)];
			$outputParts .= $modx->parseChunk( $format , $trans, '%', '%' , 'STR');
			next($aData);
		}
		return $outputParts;

	}

	function buildIteratinStringForArea($format,$aData) {
		global $modx;
		$outputParts = '';

		foreach($aData as $key=>$value) {
			$trans = array();
			$trans['CNT'] = $key;
			$trans['STRING'] = $value;
			$outputParts .= $modx->parseChunk( $format , $trans, '%', '%' , 'STR');
		}
		return $outputParts;

	}

	function returnKeyValue($key , $url_decode_flag = 0){
		$value = '';
		if ( isset( $_GET[$key] ) ) {
			if ($url_decode_flag == 1) {
				$value = rawurldecode($_GET[$key]);
			} else {
				$value = htmlentities($_GET[$key]);
			}
		}
		if ( isset( $_POST[$key] ) ) {
			if ($url_decode_flag == 1) {
				$value = rawurldecode($_POST[$key]);
			} else {
				$value = htmlentities($_POST[$key]);
			}
		}
		return $value;
	}

	function washParamData ($data, $charset='UTF-8', $quote_style=ENT_QUOTES) {
		//配列だったら
		if (is_array($data)) {
			foreach ($data as $key => $val) {
				//keyがエスケープされた場合、重複するため一旦データを削除
				unset($data[$key]);
				//文字列の文字コードを同じ文字コードへ変換し、有効ではない文字を取り除く
				$key = mb_convert_encoding($key, $charset, $charset);
				//エンティティ化
				$key = htmlentities($key, $quote_style, $charset);
				if (is_array($val)) {
					//値が配列の場合、再帰的に配列を処理
					$val = washParamData($val, $charset, $quote_style);
				} else {
					if (!is_object($val)) {
						//文字列の文字コードを同じ文字コードへ変換し、有効ではない文字を取り除く
						$val = mb_convert_encoding($val, $charset, $charset);
						//エンティティ化
						$val = htmlentities($val, $quote_style, $charset);
					}
				}
				//値を再設定
				$data[$key] = $val;
			}
			//エンティティ化した配列を返す
			return $data;
		} else {
			//文字列の文字コードを同じ文字コードへ変換し、有効ではない文字を取り除く
			$data = mb_convert_encoding($data, $charset, $charset);
			//エンティティ化して返す
			return htmlentities($data, $quote_style, $charset);
		}
	}


	function makeORANDstringForMuntiPurpose ( $a_value , $a_master_string , $s_db_field , $add_condition = " OR " ) {
		global $modx;

		$s_output_string = "";
		$and_string = $add_condition;
		$and_buff   = "";

		if ( count ( $a_value ) != 0 ) {
			$i_count_max = count ( $a_value );
			for ( $i_count = 0 ; $i_count < $i_count_max ; $i_count ++ ) {
				if ( $a_value [ $i_count ] != "" ) {
					$buff_string      = $modx->db->escape( $a_master_string [ intval( $a_value [ $i_count ] ) ] );
					$s_output_string .= $and_buff;
					$s_output_string .= " " . $s_db_field . " LIKE '%" . $buff_string . "%'"; // 条件をセット
					$and_buff         = $and_string;
				}
			}
		}

		return $s_output_string;

	}

	function makeOrAndFreeStringForMuntiPurpose ( $a_value , $s_db_field , $add_condition = " OR " ) {
		global $modx;

		$s_output_string = "";
		$and_string = $add_condition;
		$and_buff   = "";

		if ( count ( $a_value ) != 0 ) {
			$i_count_max = count ( $a_value );
			for ( $i_count = 0 ; $i_count < $i_count_max ; $i_count ++ ) {
				if ( $a_value [ $i_count ] != "" ) {
					$buff_string      = $modx->db->escape( $a_value [ $i_count ] );
					$s_output_string .= $and_buff;
					$s_output_string .= " " . $s_db_field . " LIKE '%" . $buff_string . "%'"; // 条件をセット
					$and_buff         = $and_string;
				}
			}
		}

		return $s_output_string;

	}


// セキュリティトークンのセット
	function setSecurityToken($name='token') {
		$uuid = uuidV4();
		$_SESSION[$name] = $uuid;
		return md5(UUIDSESSSEED) . $uuid;
	}

// uuid v4の生成
	function uuidV4() {
		return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
			mt_rand(0, 0xffff), mt_rand(0, 0xffff),
			mt_rand(0, 0xffff),
			mt_rand(0, 0x0fff) | 0x4000,
			mt_rand(0, 0x3fff) | 0x8000,
			mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
		);
	}

// セキュリティトークンのチェック
	function checkSecurityToken($name='token' , $reset='') {
		$session_token = $_SESSION[$name];

		if(!empty($reset)) {
			$_SESSION[$name] = '';
		}
		$token = returnKeyValue('_' . $name);

		if(!$session_token || empty($token)) {
			return false;
		}

		$session_token = md5(UUIDSESSSEED). $session_token;

		if($session_token != $token) {
			return false;
		}

		return true;
	}

	function debug_logger($str){
		global $modx;
		$datetime = date( "Y/m/d (D) H:i:s", time() );//日時
		$client_ip = $_SERVER["REMOTE_ADDR"];//クライアントのIP
		$request_url = $_SERVER["REQUEST_URI"];//アクセスしたURL
		$msg = "[{$datetime}][logger][client {$client_ip}][url {$request_url}]{$str}";
		error_log($msg."\n", 3, $modx->config['base_path']."/temp/export/debug.log");
		chmod($modx->config['base_path']."/temp/export/debug.log", 0777);
	}

	function simple_outdata_json($key , $value){
		$pub_data = array();
		$pub_data[$key] = $value;

		//クロスオリジンリソースシェアリング（CORS）
		header("Access-Control-Allow-Origin: *");

		//jsonとして出力
		header('Content-type: application/json');
		return json_encode($pub_data);

	}

	function outdata_json($pub_data){
		//クロスオリジンリソースシェアリング（CORS）
		header("Access-Control-Allow-Origin: *");

		//jsonとして出力
		header('Content-type: application/json');
		return json_encode($pub_data);

	}


