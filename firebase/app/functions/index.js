/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const VERIFY = "39c92af0-1539-4bcb-9b79-30683ff30572";

initializeApp();
const db = getFirestore();

// レスポンスを作成する
const createResponse = (request, data) => {
    const timestampUtc = new Date().getTime();
    return {
        "identifier": request.identifier,
        "idfc": request.idfc,
        "userid": data.userid ? data.userid : "",
        "userDisplayName": data.userDisplayName ? data.userDisplayName : "",
        "value": data.value,
        "timestamp_utc": timestampUtc,
    };
};

// Firestore からデータをロードする
const loadMessageBoard = (request) => {
  return new Promise((resolve, reject) => {
    try {
      db
      .collection(request.identifier)
      .doc("message-board")
      .get()
      .then((doc) => {
        if (doc.exists) {
          logger.log("Document data:", doc.data());
          const data = doc.data();
          const response = JSON.stringify(createResponse(request, data));
          const result = {
            "verify": VERIFY,
            "response": response,
          };
          resolve(result);
        } else {
          // なかった場合 doc 新規作成
          db.collection(request.identifier)
            .doc("message-board")
            .set({"value": ""})
            .then(() => {
                logger.log("Document successfully written!");
            });
          const data = {
              "value": "",
          };
          const response = JSON.stringify(createResponse(request, data));
          const result = {
            "verify": VERIFY,
            "response": response,
          };
          resolve(result);
        }
      });
    } catch (error) {
      logger.error("Error writing document: ", error);
      const result = {
        "verify": VERIFY,
        "response": error,
      };
      resolve(result);
    }
  });
};

// Firestore にデータをセーブする
const saveMessageBoard = (request) => {
  return new Promise((resolve, reject) => {
      const data = {
          "identifier": request.identifier,
          "idfc": request.idfc ? request.idfc : "",
          "userid": request.userid ? request.userid : "",
          "userDisplayName": request.userDisplayName ? request.userDisplayName : "",
          "value": request.value,
      };
      try {
        db.collection(request.identifier)
          .doc("message-board")
          .set(data)
          .then(() => {
              logger.log("Document successfully written!");
              const response = JSON.stringify(createResponse(request, data));
              const result = {
                  "verify": VERIFY,
                  "response": response,
              };
              resolve(result);
          });
      } catch (error) {
        logger.error("Error writing document: ", error);
        const result = {
            "verify": VERIFY,
            "response": error,
        };
        resolve(result);
      }
  });
};

exports.api = onRequest( async (req, resp) => {
  console.log(`api req.method = ${req.method}`, req.body);
  switch (req.method) {
    case "GET":
      // GET は サンプルレスポンスを返す
      resp.send({message: "Hello from Firebase!"});
      break;
    case "POST":
      const request = JSON.parse(req.body.request);
      const cmd = request.cmd.toUpperCase();
      switch (cmd) {
        case "MESSAGE_BOARD_LOAD_TEXT":
          {
            const result = await loadMessageBoard(request);
            resp.json(result);
          }
          break;
        case "MESSAGE_BOARD_SAVE_TEXT":
          {
            const result = await saveMessageBoard(request);
            resp.json(result);
          }
          break;
        default:
          break;
      }
      break;
    default:
      resp.status(404).send("Not Found");
  }
});
