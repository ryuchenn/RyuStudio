import { mockEvents } from '../src/constants/eventsMock.mock';
import { eventDb } from '../src/DB';

async function insertMockEventsData() {
  try {
    for (const event of mockEvents) {
      const eventData = { ...event };
      const eventId = eventData.id;
      delete (eventData as any).id;
      await eventDb.collection('event').doc(eventId).set(eventData);
      console.log(`Inserted event ${eventId}`);
    }
    console.log('All events inserted.');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting events:', error);
    process.exit(1);
  }
}

insertMockEventsData();
