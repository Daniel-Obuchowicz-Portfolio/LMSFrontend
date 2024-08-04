// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import Dashboard from './screens/Dashboard';
import Readers from './screens/Readers';
import Readerdetails from './screens/Readerdetails';
import Books from './screens/Books';
import BookDetails from './screens/Bookdetails';
import ReaderAdd from './screens/ReaderAdd';
import BookAdd from './screens/BookAdd';
import Search from './screens/Search';
import ReaderdetailsBorrowings from './screens/ReaderdetailsBorrowings';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/readers" element={<Readers />} />
      <Route path="/reader/add" element={<ReaderAdd />} />
      <Route path="/readerdetails/:id" element={<Readerdetails />} />
      <Route path="/readerdetails/:id/borrowings" element={<ReaderdetailsBorrowings />} />
      <Route path="/books" element={<Books />} />
      <Route path="/bookdetails/:id" element={<BookDetails />} />
      <Route path="/book/add" element={<BookAdd />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}

export default App;
