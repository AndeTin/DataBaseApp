import React, { useState } from 'react';
import './Login.css'; // Assuming you have a CSS file for styling

function Login({ onLoginSuccess, switchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await fetch('http://localhost:4001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      onLoginSuccess();
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <div className="switch">
        <span>Don't have an account?</span>
        <button onClick={switchToSignUp} className="switch-button">Sign Up</button>
      </div>
    </div>
  );
}

export default Login;
