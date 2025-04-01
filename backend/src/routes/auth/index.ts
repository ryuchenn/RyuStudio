import express, { NextFunction, Request, Response } from 'express';
import { authDb, authAuth } from '../../DB/index';
import { verifyAuthToken } from "../../Middleware/auth.middleware";

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

/**
 * GET /profile
 * Get "Authentication" and "account" collection all fields by account.id(uid)
 */
router.get('/profile', verifyAuthToken, async (req: Request, res: Response): Promise<any> => {
  const uid = (req as any).uid; // From middleware
  try {
    const userRecord = await authAuth.getUser(uid); // "account" collection
    const accountDoc = await authDb.collection('account').doc(uid).get(); // "account" collection

    if (!accountDoc.exists) {
      return res.status(404).json({ message: 'Account not found' });
    }
    const accountData = accountDoc.data();

    res.status(200).json({ 
      message: 'User verified',
      user: userRecord.toJSON(),
      accountData: accountData
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: `Invalid token ${error}` });
  }
});

/**
 * POST /profile
 * Update "Authentication" and "account" collection [displayName] and [phoneNumber] by account.id(uid)
 */
router.post('/profile', verifyAuthToken, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const uid = (req as any).uid; // From middleware
  const { displayName, phoneNumber } = req.body; // From front-end
  try {
    // Update "account" collection [displayName] and [phoneNumber] by account.id(uid)
    await authDb.collection('account').doc(uid).update({
      displayName,
      phoneNumber,
      updateAt: new Date().toISOString(),
    });
    
    // Update "Authentication" [displayName]by account.id(uid)
    await authAuth.updateUser(uid, { displayName });

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Profile update failed', error });
  }
});

/**
 * POST /signup
 * Insert the new account data to "Authentication" and "account" collection.
 */
router.post('/signup', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, phoneNumber, displayName, password, pictureURL } = req.body; // From front-end
    
    // Check required fields
    if (!email || !password || !displayName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check unique email
    let existingUser;
    try {
      existingUser = await authAuth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Firebase Authentication
    const userRecord = await authAuth.createUser({
      email,
      password,
      displayName,
    });
    
    // Firestore Database
    const newUser = {
      uid: userRecord.uid,
      email,
      displayName,
      phoneNumber,
      pictureURL,
      role: "Normal",
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    await authDb.collection('account').doc(userRecord.uid).set(newUser);
    res.status(201).json({ message: 'Signup Successful', uid: userRecord.uid, user: newUser });
  } catch (error) {
    console.error('Signup Failed', error);
    res.status(500).json({ message: 'Signup Failed', error });
  }
});

/**
 * POST /checkToken
 * Check the token is expired or not
 */
router.get('/checkToken', async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = await authAuth.verifyIdToken(token);
    
    res.status(200).json({ message: 'Token valid', decoded });
  } catch (error) {
    console.error('Token check error:', error);
    res.status(401).json({ message: 'Invalid or expired token', error });
  }
});

export default router;