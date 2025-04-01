export interface SessionDetail {
    sessionID: string;
    startDate: string;
    endDate?: string;
    price?: number;
    remain?: number;
    available?: number;
    type?: string;
  }