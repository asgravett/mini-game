const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = process.env.PORT || 8000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 5173;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${FRONTEND_PORT}`,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware setup
app.use(
  cors({ origin: `http://localhost:${FRONTEND_PORT}`, credentials: true })
);
app.use(express.json());
app.use(cookieParser());

const sessionMiddleware = session({
  secret: 'super-secret-key', // Change this in production
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Prevents JS access to the cookie
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 24-hour session
  },
});

app.use(sessionMiddleware);

// Attach session to Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// **Check If User Is Logged In (For Reconnect)**
app.get('/me', (req, res) => {
  console.log('Check If User Is Logged In (For Reconnect)');
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// **Login Route: Set Username in Session**
app.post('/login', (req, res) => {
  console.log('**Login Route: Set Username in Session**');
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  req.session.user = { username };
  res.json({ message: 'Logged in successfully', username });
});

// **Logout Route: Clear Session**
app.post('/logout', (req, res) => {
  console.log('Logout Route: Clear Session');
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// **Socket.IO Connection Handling**
io.on('connection', (socket) => {
  const session = socket.request.session;
  if (!session || !session.user) {
    console.log('Unauthorized connection');
    socket.disconnect(); // Reject unauthorized clients
    return;
  }

  console.log(`User connected: ${session.user.username}`);

  socket.emit('welcome', { message: `Welcome ${session.user.username}!` });

  socket.on('message', (data) => {
    console.log(`Message from ${session.user.username}:`, data);
    io.emit('message', { user: session.user.username, text: data });
  });

  socket.on('disconnect', () => {
    console.log(`${session.user.username} disconnected`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
