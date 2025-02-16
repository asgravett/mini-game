import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000', {
  withCredentials: true,
});

function Rooms() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 space-y-4">
      <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
      <div
        className="w-full max-w-md p-4 bg-white rounded-lg shadow-md overflow-y-auto"
        style={{ maxHeight: '300px' }}
      >
        {messages.map((msg, index) => (
          <div key={index} className="p-2 border-b border-gray-200">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;
