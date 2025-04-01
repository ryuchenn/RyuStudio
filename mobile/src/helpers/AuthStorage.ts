import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  isLoggedIn: 'isLoggedIn',
  uid: 'uid',
  role: 'role',
  email: 'email',
  phoneNumber: 'phoneNumber',
  displayName: 'displayName',
  token: 'token',
};

const AuthStorage = {
  async saveUser({
    uid,
    role,
    email,
    phoneNumber,
    displayName,
    token,
  }: {
    uid: string;
    role: string,
    email: string;
    phoneNumber: string,
    displayName: string;
    token: string;
  }) {
    await AsyncStorage.multiSet([
      [KEYS.isLoggedIn, 'true'],
      [KEYS.uid, uid],
      [KEYS.role, role],
      [KEYS.email, email],
      [KEYS.phoneNumber, phoneNumber],
      [KEYS.displayName, displayName],
      [KEYS.token, token],
    ]);
  },

  async getUser() {
    const values = await AsyncStorage.multiGet([
      KEYS.isLoggedIn,
      KEYS.uid,
      KEYS.role,
      KEYS.email,
      KEYS.phoneNumber,
      KEYS.displayName,
      KEYS.token,
    ]);

    const user = Object.fromEntries(values);
    return {
      isLoggedIn: user[KEYS.isLoggedIn] === 'true',
      uid: user[KEYS.uid] || '',
      role: user[KEYS.role] || '',
      email: user[KEYS.email] || '',
      phoneNumber: user[KEYS.phoneNumber] || '',
      displayName: user[KEYS.displayName] || '',
      token: user[KEYS.token] || '',
    };
  },

  async clearUser() {
    await AsyncStorage.multiRemove([
      KEYS.isLoggedIn,
      KEYS.uid,
      KEYS.role,
      KEYS.email,
      KEYS.phoneNumber,
      KEYS.displayName,
      KEYS.token,
    ]);
  },
};

export default AuthStorage;