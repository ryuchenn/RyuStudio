import { Request, Response, NextFunction } from 'express';
import { authAuth, authDb } from '../DB/index';

interface AuthRequest extends Request {
  user?: {
    uid: string;
  };
}

/**
 * Verify Authentication Token
 * Using in Authentication Database for verifying token
 */
export async function verifyAuthToken(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await authAuth.verifyIdToken(token);
    
    (req as any).uid = decodedToken.uid; // Append uid to the req object
    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    res.status(401).json({ message: `Invalid token OR token expired: ${error}` });
  }
}

/**
 * Verify Authentication
 * Using in Authentication Database for checking the role in account collection is Admin or Normal
 */
export async function checkAdmin (req: AuthRequest, res: Response, next: NextFunction): Promise<any>{
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ message: 'Unauthorized: no user information' });
  }
  try {
    const accountDoc = await authDb.collection('account').doc(req.user.uid).get();
    if (!accountDoc.exists) {
      return res.status(403).json({ message: 'Forbidden: User account not found' });
    }
    const accountData = accountDoc.data();
    if (!accountData || accountData.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    
    next(); // If the role is Admin do the next step
  } catch (error) {
    console.error('Error in checkAdmin middleware:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
