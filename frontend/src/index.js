import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import disableReactDevTools from '@fvilers/disable-react-devtools';

if(process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);