import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const Login = ({ onLoginSuccess, switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform login validation and submission logic here
    // For now, just log the form data to console
    console.log({
      email,
      password
    });

    // Send login request to server
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
        // Login successful
        setMessage(data.message);
        // Push user to home page upon successful login
        navigate('/');
        // Perform any necessary actions upon successful login, such as updating user login status
        onLoginSuccess();
      } else {
        // Login failed
        setMessage(data.message);
      }
    })
    .catch(error => {
      console.error('Error logging in:', error);
      // Handle error, e.g., display error message to user
      setMessage('An error occurred while logging in. Please try again.');
    });
  };

  return (
    <div className="container">
      <h2>登錄</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="電子郵件"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">登錄</button>
      </form>
      <div>{message}</div> {/* Display login message */}
      <div className="switch">
        沒有帳號？ <a href="javascript:void(0)" onClick={switchToSignUp}>註冊</a>
      </div>
    </div>
  );
};

export default Login;
