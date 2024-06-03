import React, { useState } from 'react';

const Login = ({ onLoginSuccess, switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login validation and submission logic here
    // For now, just log the form data to console
    console.log({
      email,
      password
    });
    onLoginSuccess();
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
      <div className="switch">
        沒有帳號？ <a href="javascript:void(0)" onClick={switchToSignUp}>註冊</a>
      </div>
    </div>
  );
};

export default Login;
