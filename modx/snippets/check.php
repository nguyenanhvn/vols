<?php
	require_once($modx->config['base_path'] . 'assets/snippets/tools/sharedfuction.inc.php');

// 処理対象のコンテンツID
	if ( isset ($id) && intval($id) ) {
		$contents_id = intval($id);
	} else {
		$contents_id = $modx->documentIdentifier;
	}

// 親ドキュメントのセット
	$a_parent_data = $modx->getTemplateVarOutput( "*" , $contents_id );

// ページネートするならば
	if ( isset ($pageNate) ) {
		$page_nate = 1;
		if ( isset ($_GET['PGN']) ) {
			$pagenate_count = intval($_GET['PGN']);
		} else {
			$pagenate_count = 0;
		}
	} else {
		$page_nate = 0;
		$pagenate_count = 0;
	}

// 表示する件数
	if ( isset ($cnt) && intval($cnt) ) {
		$publish_count = intval($cnt);
		if ( $publish_count == 0 ) {
			$publish_count = "999";
		}
	} else {
		$publish_count = "999";
	}


// タイトルの文字数制限
	if ( isset ($titleLimit) && intval($titleLimit) ) {
		$title_limit = intval($titleLimit);
	} else {
		$title_limit = "0";
	}

// 本文の文字数制限
	if ( isset ($contentLimit) && intval($contentLimit) ) {
		$content_limit = intval($contentLimit);
	} else {
		$content_limit = "0";
	}

// ソート種別
// 1:createdon 2:editedon
	if ( isset ($sortType) && intval($sortType) ) {
		$sort_type = intval($sortType);
	} else {
		$sort_type = "99";
	}

// 1件分を表示するチャンク
	if ( isset ($tpl) ) {
		$chunk_one_case = $tpl;
	} else {
		$chunk_one_case = 'content_block01';
	}



// 外枠を表示するチャンク
	if ( isset ($outtpl) ) {
		$chunk_frame = $outtpl;
	} else {
		$chunk_frame = 'outer_content_block';
	}

// 1件もない場合、表示するチャンク
	if ( isset ($noFrame) ) {
		$nothing_frame = $noFrame;
	} else {
		$nothing_frame = '';
	}


// コンテンツテーブル
	$content_table_name = $modx->getFullTableName( 'site_content' );

// テンプレート変数テーブル
	$contentvalues_table_name = $modx->getFullTableName( 'site_tmplvar_contentvalues' );


	// 引数取得
	$param = washParamData($_GET);

	$model = '';
	$modelcode = '';
	if (isset($param['model'])) {
		$model = $modx->db->escape(trim($param['model']));
	}

	if (isset($param['modelcode'])) {
		$modelcode = $modx->db->escape(trim($param['modelcode']));

	}

// テンプレート変数のID
	/*

     登録車種
c_1_eng(6) エンジンルーム　1年
c_1_int(8) インテリア　1年
c_1_load(9) ロードテスト　1年
c_1_out(5) 外廻り／足廻り　1年
c_1_und(7) 下廻り　1年
c_2_eng(11) エンジンルーム　2年
c_2_int(13) インテリア　2年
c_2_load(14) ロードテスト　2年
c_2_out(10) 外廻り／足廻り　2年
c_2_und(12) 下廻り　2年
c_engine_type(1) エンジンタイプ
c_model(2) モデル名
c_model_code(3) モデルコード
c_sale_term(4) 販売期間
	    */

	$tvModel = "2"; // c_model(2) モデル名
	$tvModelCode = "3"; // c_model_code(3) モデルコード


// ----------------------------------------------------------------
// 以下からメイン処理
//

	$contentid_list = array();
	$contentid_buff_list = array();
	$publish_key_string = "";

	// 1:createdon 2:editedon
	$s_sort = "";
	if ( $sort_type == 1 ) {
		$s_sort = " ORDER BY contents.createdon DESC";
	} elseif ( $sort_type == 2 ) {
		$s_sort = " ORDER BY contents.editedon DESC";
	} elseif ( $sort_type == 3 ) {
		$s_sort = " ORDER BY tmplvar1.value ";
	} else {
		$s_sort = " ORDER BY contents.menuindex ASC";
	}

	$sql  = "SELECT ";
	$sql .= " tmplvar1.contentid ";
	$sql .= ", ";
	$sql .= " tmplvar1.value as tmplvar1_value ";
	$sql .= " FROM ";
	$sql .= $contentvalues_table_name . " AS tmplvar1 ";
	$sql .= ", ";

	if ($modelcode != '') {
		$sql .= $contentvalues_table_name . " AS tmplvar2 ";
		$sql .= ", ";
	}

	$sql .= $content_table_name       . " AS contents ";
	$sql .= " WHERE ";
	$sql .= " tmplvar1.contentid = contents.id ";
	$sql .= " AND ";
	$sql .= " contents.template = 2 ";
	$sql .= " AND ";
	$sql .= " contents.published = 1 ";
	$sql .= " AND ";
	$sql .= " contents.deleted = 0 ";
	$sql .= " AND ";
	$sql .= " contents.parent = '" . $contents_id ."' ";
	$sql .= " AND ";
	$sql .= " tmplvar1.tmplvarid = '" . $tvModel ."' ";
	$sql .= " AND ";
	$sql .= " tmplvar1.value IS NOT NULL ";

	if ($model != '') {
		$sql .= " AND ";
		$sql .= " tmplvar1.value = '" . $model ."' ";
	}

	if ($modelcode != '') {
		$sql .= " AND ";
		$sql .= " tmplvar2.contentid = contents.id ";
		$sql .= " AND ";
		$sql .= " tmplvar2.tmplvarid = '" . $tvModelCode ."' ";
		$sql .= " AND ";
		$sql .= " tmplvar2.value = '" . $modelcode ."' ";
	}


	$sql .= $s_sort;


	$rs= $modx->dbQuery($sql);
	$rowCount= $modx->recordCount($rs);
	if ($rowCount > 0) {
		for ($i= 0; $i < $rowCount; $i++) {
			$row= $modx->fetchRow($rs);
			$contentid_list[ $i ]= $row['contentid'];
		}
	}

	$output = "";
	$output_buff = array();
	$count_max = count ( $contentid_list );



	// --------------------------------------------------
	// 表示処理
	// --------------------------------------------------
	$count_max = count ( $contentid_list );

	// 検索結果表示処理 はじめ
	// --------------------------------------------------
	if ( $count_max != 0  ) {

		for ( $count = 0 ; $count < $count_max ; $count ++ ) {

			// 表示すべきページのみ表示組み立て
			if ( ( ( $publish_count * $pagenate_count ) <= $count ) && ( $count < ( $publish_count * ( $pagenate_count + 1 ) ) ) ) {


				// 1件分のドキュメント取り出し
				$a_data  = $modx->getTemplateVarOutput( "*" , $contentid_list[ $count ] );

				// 特殊な情報を組み立て
				$a_add_data = array ();

				// 日時の組み立て
				if ($a_data ['pub_date'] == 0) {
					$a_data ['pub_date'] = $a_data ['createdon'];
				}
				$a_add_data [ 'jpn_date' ]     = date('Y年m月d日' , $a_data ['pub_date']);


				// 出力用配列にマージ
				$a_data = array_merge( $a_data , $a_add_data );

				// 配列へ出力
				$output_buff[] = $a_data;

			}

		}
	}

	if ( $output_buff != "" ) {
		//jsonとして出力
		return outdata_json($output_buff);
	} else {
		//jsonとして出力
		return simple_outdata_json('Result' , 'NG');
	}


?>