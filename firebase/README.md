# 伝言板 - 外部通信機能を使ったサンプル
firebase を使ったサーバ側コード一式  

# ローカル実行 エミューレーター
```bash
# ローカル実行 エミューレーター
firebase emulators:start

# エミューレーターの管理画面
open http://127.0.0.1:4000/
```

```bash
# ローカル実行 エミューレーターへのリクエスト
curl -X POST \
-H "Content-Type: application/json" \
-d '{"request": "{\"identifier\":\"094fdec8-c67d-4e85-987c-654757712e15-message-board-1\",\"cmd\":\"MESSAGE_BOARD_LOAD_TEXT\"}"}' \
"http://127.0.0.1:5001/message-board-sample/us-central1/api"

curl -X POST -H "Content-Type: application/json" \
-d '{"request": "{\"identifier\":\"094fdec8-c67d-4e85-987c-654757712e15-message-board-1\",\"cmd\":\"MESSAGE_BOARD_SAVE_TEXT\",\"value\":\"uuuu\",\"idfc\":\"a3b85d11702c76e88eb253895acb99d6\"}"}' \
"http://127.0.0.1:5001/message-board-sample/us-central1/api"
```

# デプロイ

```bash
cd app
firebase deploy

firebase functions:list
```

```bash
# デプロイした環境
curl -X POST -H "Content-Type: application/json" \
-d '{"request": "{\"identifier\":\"094fdec8-c67d-4e85-987c-654757712e15-message-board-1\",\"cmd\":\"MESSAGE_BOARD_LOAD_TEXT\"}"}' \
"https://api-us6n5pkkoq-uc.a.run.app"

curl -X POST -H "Content-Type: application/json" \
-d '{"request": "{\"identifier\":\"094fdec8-c67d-4e85-987c-654757712e15-message-board-1\",\"cmd\":\"MESSAGE_BOARD_SAVE_TEXT\",\"value\":\"テスト\",\"idfc\":\"a3b85d11702c76e88eb253895acb99d6\"}"}' \
"https://api-us6n5pkkoq-uc.a.run.app"
```