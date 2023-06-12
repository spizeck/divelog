import React from 'react';
// import Header from './Header';
// import Navigation from './Navigation';
import DiveForm from './DiveForm';
import {ReactComponent as Logo} from "./logo.svg"

const App = () => {
  return (
    <div>
      {/* <Header /> */}
      <h1> <Logo /></h1>
      {/* <Navigation /> */}
      <DiveForm />
    </div>
  );
};

export default App;
