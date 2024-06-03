import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SearchList from './SearchList';
import LocationInfo from './LocationInfo';
import Login from './Login';
import SignUp from './SignUp';
import './App.css'; // Import the CSS file

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const switchToSignUp = () => {
    setShowSignUp(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchList />} />
          <Route path="/location/:id" element={<LocationInfo />} />
          <Route 
            path="/login" 
            element={
              showSignUp ? (
                <SignUp />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} switchToSignUp={switchToSignUp} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
