import React, { useEffect, useState } from 'react';
// import Header from './Header';
// import Navigation from './Navigation';
import DiveForm from './containers/DiveForm';
import Login from './containers/Login';
// import {ReactComponent as Logo} from "./logo.svg"


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoggedIn(true);
    }
  }, []);

  const content = loggedIn ? (
    <div className="form-container">
      <DiveForm />
    </div>
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );

  return (
    <div>
      {/* <Header /> */}
      {/* <Navigation /> */}
      {content}
    </div>
  );
};

export default App;
