import React, { useState } from 'react';

const SignUp = () => {
  // Define state variables for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form validation and submission logic here
    // For now, just log the form data to console
    console.log({
      firstName,
      lastName,
      email,
      gender,
      birthday,
      password
    });
  };

  // Function to switch to the login form
  const switchToLogin = () => {
    // Implement the logic to switch to the login form here
    console.log('Switching to login form...');
  };

  return (
    <div className="container">
      <h2>註冊</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="名字"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="姓氏"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="電子郵件"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled selected>選擇性別</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div>
          <input
            type="date"
            placeholder="生日"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
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
        <button type="submit">註冊</button>
      </form>
      <div className="switch">
        已經有帳號了？ <a href="javascript:void(0)" onClick={switchToLogin}>登錄</a>
      </div>
    </div>
  );
};

export default SignUp;
