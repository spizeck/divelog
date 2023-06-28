import React from 'react';
// import Header from './Header';
// import Navigation from './Navigation';
import DiveForm from './components/DiveForm';
// import {ReactComponent as Logo} from "./logo.svg"
import './styles/DiveForm.css'

const App = () => {
  return (
    <div>
      {/* <Header /> */}
      {/* <Navigation /> */}
      <div className="form-container">
      <DiveForm />
      </div>
    </div>
  );
};

export default App;
