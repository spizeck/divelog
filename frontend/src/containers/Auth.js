import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleShowRegisterForm = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  }

  const handleShowLoginForm = () => {
    setShowLoginForm(true);
    setShowRegisterForm(false);
  }

  return (
    <div>
      {showLoginForm && <Login setShowRegisterForm={handleShowRegisterForm} />}
      {showRegisterForm && <Register setShowLoginForm={handleShowLoginForm} />}
    </div>
  )
}

export default Auth;
