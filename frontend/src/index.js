import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import QRScanner from './components/qrcode/QRScanner'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <App />
     <QRScanner/>
);
// If you want to start measuring performance in your app, pass a function