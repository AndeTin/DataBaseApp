import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SearchList from './SearchList';
import LocationInfo from './LocationInfo';
import './App.css'; // Import the CSS file

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchList />} />
          <Route path="/location/:id" element={<LocationInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
