import React from 'react';
import './app.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import DiveForm from './components/DiveForm';
import {ReactComponent as Logo} from "./logo.svg"

const App = () => {
  return (
    <div>
      <Header />
        <Logo />
      <Navigation />
      <main>
        <DiveForm />
      </main>
    </div>
  );
};

export default App;
