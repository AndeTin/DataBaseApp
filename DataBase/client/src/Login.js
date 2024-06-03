import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess, switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:4001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setMessage(data.message);
          localStorage.setItem('userEmail', email);
          onLoginSuccess();
          navigate('/');
        } else {
          setMessage(data.message);
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setMessage('An error occurred while logging in. Please try again.');
      });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>{message}</div>
      <div className="switch">
        Don't have an account? <button onClick={switchToSignUp} className="link-button">Sign Up</button>
      </div>
    </div>
  );
};

export default Login;
