// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import Dashboard from './screens/Dashboard';
import Readers from './screens/Readers';
import Readerdetails from './screens/Readerdetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/readers" element={<Readers />} />
      <Route path="/readerdetails/:id" element={<Readerdetails />} />
    </Routes>
  );
}

export default App;
