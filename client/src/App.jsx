import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Rooms from './pages/Rooms';
import Game from './pages/Game';
import ProtectedRoutes from './utils/ProtectedRoutes';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/game" element={<Game />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
