import dotenv from "dotenv";
dotenv.config();

export const serviceAuthBase64 = process.env.FIREBASE_AUTH_B64;
export const serviceEventBase64 = process.env.FIREBASE_EVENT_B64;

