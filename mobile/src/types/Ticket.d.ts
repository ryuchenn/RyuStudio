import { SessionDetail } from "./SessionDetail";

export interface Ticket {
  id: string;
  sessionID: string;
  status: string;
  QRCode: string;
  sessionDetail: SessionDetail;
}