
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import ReportsPage from './pages/ReportsPage';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<Register />}/>
      <Route path='/dashboard' element={<Dashboard />}/>
      <Route path='/user-profile' element={<UserProfile />}/>
      <Route path='/reports' element={<ReportsPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
