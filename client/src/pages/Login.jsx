import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function Login() {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    if (username === '') return;
    try {
      await axios.post(
        'http://localhost:8000/login',
        { username },
        { withCredentials: true }
      );

      navigate('/rooms');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 space-y-4">
      <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
