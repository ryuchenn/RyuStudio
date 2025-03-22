import admin from 'firebase-admin';
import { serviceAuthBase64 } from "../../constants/DBSetting";

if (!serviceAuthBase64) {
  throw new Error("serviceAuthBase64 not set");
}

const serviceAccount = JSON.parse(
  Buffer.from(serviceAuthBase64, "base64").toString("utf-8")
) as admin.ServiceAccount;

const authApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
  },
  "auth"
);

const authDb = authApp.firestore();
const authMessaging = authApp.messaging();
const authStorage = authApp.storage();

export { authDb, authMessaging, authStorage };
