import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchLawyers from './pages/SearchLawyers';
import LawyerProfile from './pages/LawyerProfile';
import ClientDashboard from './pages/ClientDashboard';
import AdvisorDashboard from './pages/AdvisorDashboard';
import Blogs from './pages/Blogs';
import CreateBlog from './pages/CreateBlog';
import BlogDetail from './pages/BlogDetail';
import AIAssistant from './pages/AIAssistant';
import AIChatbot from './components/AIChatbot';

export const ThemeContext = React.createContext();

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={darkMode ? 'dark' : ''}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchLawyers />} />
            <Route path="/lawyer/:id" element={<LawyerProfile />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/advisor-dashboard" element={<AdvisorDashboard />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/create" element={<CreateBlog />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/ai-chat" element={<AIAssistant />} />
          </Routes>
          {/* AI Chatbot appears on every page */}
          <AIChatbot />
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;