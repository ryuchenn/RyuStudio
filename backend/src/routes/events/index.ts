import express from "express";
import { mockEvents } from "../../constants/eventsMock.mock";
import { eventDb } from '../../DB/index';
const router = express.Router();

// router.get("/", async (req, res) => {
//     try {
//       res.status(200).json("Event API");
//     } catch (error) {
//       res.status(500).json({ message: "Failed to get API", error });
//     }
// });

router.get("/test_eventdb", async (req, res) => {
    try 
    {
      await eventDb.collection('test-connection').doc('event').set({ status: 'OK', timestamp: Date.now() });
      console.log('Firebase connections successful.');
    } catch (err) {
      console.error('Firebase connection failed:', err);
    }
});

router.get("/MockData", (req, res) => {
    res.status(200).json(mockEvents);
});

// Get all events data
router.get('/', async (req, res) => {
  try {
    const eventsSnapshot = await eventDb.collection('event').get();
    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(events);
  } catch (error) {
    console.error('GET events fail：', error);
    res.status(500).json({ error: 'GET events Fail' });
  }
});

export default router;