import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';

function App() {
  return (
    <div className="App">
     <Routes>
     <Route path='/' element={<HomePage />} />
     <Route path='/signup' element={<SignUp />} />
     <Route path='/login' element={<LogIn />} />
     </Routes>
    </div>
  );
}

export default App;
