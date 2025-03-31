import dotenv from "dotenv";
dotenv.config();

// The Firebase private key from .env (Command: base64 -i path/to/firebaseAuth.json)
export const serviceAuthBase64 = process.env.FIREBASE_AUTH_B64;
export const serviceEventBase64 = process.env.FIREBASE_EVENT_B64;