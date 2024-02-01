import { Route, Routes } from 'react-router-dom'
import './App.css';

import {
  HomePage,
  LoginPage,
  QuizPage,
  SignUpPage,
} from './pages'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </div>
  );
}

export default App;
