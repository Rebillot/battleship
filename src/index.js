import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import NavBar from './components/NavBar';
import { TurnProvider } from './components/Context/Context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TurnProvider> 
      <NavBar />
      <App />
    </TurnProvider>
  </React.StrictMode>
);

reportWebVitals();
