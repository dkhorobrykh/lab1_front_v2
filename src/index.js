import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthProvider} from "./context/AuthContext";
import {ErrorProvider} from "./context/ErrorContext";
import ErrorBoundary from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ErrorBoundary>
          <ErrorProvider>
              <AuthProvider>
                  <App />
              </AuthProvider>
          </ErrorProvider>
      </ErrorBoundary>
  </React.StrictMode>
);
