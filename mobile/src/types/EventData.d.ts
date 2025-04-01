// EventDetail
export interface EventData {
    eventDetail: string;
    imagesURL?: string[];
    name: string;
    session: { startDate: string }[];
    location: {
      name: string;
      address: string;
      latitude?: number;
      longitude?: number;
    };
    host: any[];
    notice: Record<string, boolean>;
    tags: string[];
}
