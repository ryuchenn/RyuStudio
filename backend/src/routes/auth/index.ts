import express from "express";
import { authDb } from '../../DB/index';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.status(200).json('Auth API');
    } catch (error) {
        res.status(500).json({ message: 'Failed to get API', error });
    }
});

router.get("/test_authdb", async (req, res) => {
    try 
    {
      await authDb.collection('test-connection').doc('auth').set({ status: 'OK', timestamp: Date.now() });
      console.log('Firebase connections successful.');
    } catch (err) {
      console.error('Firebase connection failed:', err);
    }
});

export default router;