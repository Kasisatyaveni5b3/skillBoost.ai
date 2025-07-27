
import './App.css';
import Home from './pages/home';
import Practise from './pages/practise';
import Profile from './pages/profile';
import Admin from './pages/admin';
import Navbar from './components/navbar';
import SignUp from './pages/signup';
import Parent from './practise/parent';
import Profile1 from './practise/login';
import Child from './practise/child';
import Counter from './practise/counter'

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
          <Route path="signup" element={<SignUp />} />
          <Route path="parent" element={< Parent />} />
          <Route path="child" element={< Child />} />
          <Route path="profile1" element={< Profile1 />} />
          <Route path="counter" element={< Counter />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
