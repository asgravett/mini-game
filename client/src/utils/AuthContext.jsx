import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // Check if the user is already logged in
    async function fetchUser() {
      try {
        axios
          .get('http://localhost:8000/me', { withCredentials: true })
          .then((response) => {
            console.log('me endpoint data:', response.data);
            if (response?.data?.user?.username) {
              setUser(response.data.user.username);
            }
          })
          .catch(() => {
            console.log('Not logged in');
            setUser(null);
          });
      } catch (error) {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  const login = async (username) => {
    const response = await axios.post(
      'http://localhost:8000/login',
      { username },
      { withCredentials: true }
    );
    setUser(response.data.username);
  };

  const logout = async () => {
    await axios.post('http://localhost:8000/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
