import React, { useState } from 'react';
import './SignUp.css'; // Import the CSS file

const SignUp = ({ switchToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with state values:", {
      firstName,
      lastName,
      email,
      gender,
      birthday,
      password
    });

    if (!firstName || !lastName || !email || !gender || !birthday || !password) {
      alert('Please fill out all fields');
      return;
    }

    fetch('http://localhost:4001/api/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        alert('Email address is already registered');
      } else {
        fetch('http://localhost:4001/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            User_first_name: firstName,
            User_last_name: lastName,
            User_email: email,
            User_gender: gender,
            User_birthday: birthday,
            User_passwd: password
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('You have successfully registered');
            switchToLogin();
          } else {
            alert('Registration failed. Please try again.');
          }
        })
        .catch(error => {
          console.error('Error registering user:', error);
          alert('Error registering user. Please try again.');
        });
      }
    })
    .catch(error => {
      console.error('Error checking email:', error);
      alert('Error checking email. Please try again.');
    });
  };

  return (
    <div className="container">
      <h2>註冊</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            placeholder="名字"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="姓氏"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="input-container">
          <input
            type="email"
            placeholder="電子郵件"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>選擇性別</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div className="input-container">
          <h4>生日</h4>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">註冊</button>
      </form>
      <div className="switch">
        已經有帳號了？ <button onClick={switchToLogin} className="link-button">登錄</button>
      </div>
      <button onClick={() => window.location.href = '/'}>返回首頁</button>
    </div>
  );
};

export default SignUp;
