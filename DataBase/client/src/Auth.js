import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthday: ''
  });
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      gender: '',
      birthday: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:4001/login' : 'http://localhost:4001/signup';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (data.success) {
      if (isLogin) {
        navigate('/home');
      } else {
        alert('Registration successful');
        handleSwitch();
      }
    } else {
      alert(`Failed: ${data.message}`);
    }
  };

  return (
    <div className="container">
      <h2>{isLogin ? '會員登錄' : '註冊'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              id="firstName"
              placeholder="名字"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              id="lastName"
              placeholder="姓氏"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <select id="gender" value={formData.gender} onChange={handleChange} required>
              <option value="" disabled>選擇性別</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
            <input
              type="date"
              id="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="email"
          id="email"
          placeholder="電子郵件"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="密碼"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? '登錄' : '註冊'}</button>
      </form>
      <div className="switch">
        {isLogin ? (
          <>
            還沒有帳號？ <a href="#" onClick={handleSwitch}>註冊</a>
          </>
        ) : (
          <>
            已經有帳號了？ <a href="#" onClick={handleSwitch}>登錄</a>
          </>
        )}
      </div>
    </div>
  );
}

export default Auth;
