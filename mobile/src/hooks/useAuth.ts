import { useEffect, useState } from 'react';
import AuthStorage from '@/helpers/AuthStorage';

interface AuthUser {
  isLoggedIn: boolean;
  uid: string;
  role: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  token: string;
}

export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AuthStorage.getUser();
      setUser(storedUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  return {
    user,
    isLoggedIn: user?.isLoggedIn ?? false,
    loading,
  };
}

