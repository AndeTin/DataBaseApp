import React from 'react';
import SignUp from './SignUp';
import Login from './Login';

class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignUp: true
    };
  }

  switchToLogin = () => {
    this.setState({ isSignUp: false });
  };

  render() {
    const { isSignUp } = this.state;
    return (
      <div>
        {isSignUp ? <SignUp switchToLogin={this.switchToLogin} /> : <Login />}
      </div>
    );
  }
}

export default AuthPage;
