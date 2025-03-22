import admin from 'firebase-admin';
import { serviceEventBase64 } from "../../constants/DBSetting";

if (!serviceEventBase64) {
  throw new Error("ServiceEventBase64 not set");
}

const serviceAccount = JSON.parse(
  Buffer.from(serviceEventBase64, "base64").toString("utf-8")
) as admin.ServiceAccount;

const eventApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
  },
  "event"
);

const eventDb = eventApp.firestore();
const eventMessaging = eventApp.messaging();
const eventStorage = eventApp.storage();

export { eventDb, eventMessaging, eventStorage };
