import { authDb, eventDb } from '../src/DB/index';

// npm run test:firebase
async function testDB() {
  try {
    await authDb.collection('test-connection').doc('auth').set({ status: 'OK', timestamp: Date.now() });
    await eventDb.collection('test-connection').doc('event').set({ status: 'OK', timestamp: Date.now() });
    console.log('Firebase connections successful.');
  } catch (err) {
    console.error('Firebase connection failed:', err);
  }
}

testDB();
