import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
// import Navbar from './components/Navbar';
function App() {
  return (
    <BrowserRouter>
    {/* <Navbar/> */}
      <Routes>
        <Route exact path='/' element={<Home />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
