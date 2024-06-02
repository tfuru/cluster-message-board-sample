/** 伝言板 外部通信を利用したサンプル
 * 
 * 1. インタラクトすると掲示板内容を削除
 * 
 * Cluster Creator Kit Script Reference
 * https://docs.cluster.mu/script/
 * 
 */

// ワールドや機能の識別子
const IDENTIFIER = "dummy-message-board-1";

// 外部通信で送信する meta の値
const CMD_SAVE_TEXT = "MESSAGE_BOARD_SAVE_TEXT";

// 外部通信でサーバーににテキストを送信する
const saveTextToServer = (player, text) => {
    // $.log(`sendTextToServer : ${text}`);
    const request = JSON.stringify({
        identifier: IDENTIFIER,
        cmd: CMD_SAVE_TEXT,
        value: text,
        idfc: player.idfc,
        userid: player.userid,
        userDisplayName: player.userDisplayName
    });
    $.callExternal(request, CMD_SAVE_TEXT);
}

$.onInteract(player => {
    $.state.player = player;
    saveTextToServer(player, "");
});

// サーバーからのレスポンスを受け取る
$.onExternalCallEnd(((response, meta, errorReason) => {
    $.log(`onExternalCallEnd : ${response}`);
    $.log(`onExternalCallEnd : ${meta}`);
    $.log(`onExternalCallEnd : ${errorReason}`);

    if (errorReason !== null) {
        $.log(`onExternalCallEnd : errorReason`);
        return;
    }
}));