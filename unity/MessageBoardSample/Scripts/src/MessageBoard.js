/** 伝言板 外部通信を利用したサンプル
 * 
 * 1.  
 * 2. インタラクトするとテキスト入力欄が表示される
 * 3. 入力されたテキストを サーバに送信する
 * 4. サーバからのレスポンスを受けてその内容をTextViewに表示する
 * 
 * 
 * Cluster Creator Kit Script Reference
 * https://docs.cluster.mu/script/
 * 
 */

// ワールドや機能の識別子
const IDENTIFIER = "dummy-message-board-1";

// 外部通信で送信する meta の値
const CMD_LOAD_TEXT = "MESSAGE_BOARD_LOAD_TEXT";
const CMD_SAVE_TEXT = "MESSAGE_BOARD_SAVE_TEXT";

// １行の文字数
const LINE_COUNT = 20;

// 外部通信でサーバーににテキストを取得する
const loadTextToServer = () => {
    // $.log(`loadTextToServer`);
    const request = JSON.stringify({
        identifier: IDENTIFIER,
        cmd: CMD_LOAD_TEXT,
    });
    $.callExternal(request, CMD_LOAD_TEXT);
}

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

$.onStart(() => {
    // サーバーからテキストを取得する
    loadTextToServer();
});

$.onInteract(player => {
    $.state.player = player;
    // インタラクトしたプレイヤーにテキスト入力欄を表示する
    player.requestTextInput("SET_MESSAGE", "伝言板に書き込むメッセージを入力してください");
});

// プレイヤーがテキスト入力欄に入力した際の処理
$.onTextInput((text, meta, status) => {
    if (meta !== "SET_MESSAGE") return;
    switch(status) {
        case TextInputStatus.Success:          
            // 外部通信でサーバーににテキストを送信する
            saveTextToServer($.state.player, text);
            break;
        case TextInputStatus.Busy:
            // プレイヤーが入力しなかった場合
            break;
        case TextInputStatus.Refused:
            // 拒否された場合
            break;
      }
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

    const data = JSON.parse(response);
    const userid = data.userid ?? "";
    const userDisplayName = data.userDisplayName ?? "";
    let value = data.value;
    if (value.length === 0) {
       // メッセージがない場合
       return
    }

    const textView = $.subNode("TextView");
    if (textView) {
        // 自動改行 LINE_COUNT 文字で改行する
        if (value.length > LINE_COUNT) {
            const m = value.match(new RegExp('.{1,' + LINE_COUNT + '}', 'g'));
            value = m.join('\n');
        }
 
        // サーバーレスポンスをTextViewに表示する
        textView.setText(`${userid}\n${userDisplayName}\n ${value}`);
    }
}));