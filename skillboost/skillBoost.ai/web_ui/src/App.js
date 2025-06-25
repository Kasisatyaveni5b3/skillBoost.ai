
import './App.css';
import Home from './pages/home';
import Practise from './pages/practise';
import Profile from './pages/profile';
import Admin from './pages/admin';
import Navbar from './components/navbar';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
  <Route index element={<Home />} />
  <Route path="home" element={<Home />} />
  <Route path="practise" element={<Practise />} />
  <Route path="profile" element={<Profile />} />
  <Route path="admin" element={<Admin />} />
</Route>

        </Routes>
    </BrowserRouter>
  );
}

export default App;
