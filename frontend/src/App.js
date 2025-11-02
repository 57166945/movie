import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import AddEditReview from './pages/AddEditReview';
import About from './pages/About';
import EditReview from "./pages/EditReview";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/search" element={<Search/>} />
          <Route path="/movie/:id" element={<MovieDetail/>} />
          <Route path="/add-review/:id" element={<AddEditReview/>} />
          <Route path="/edit-review/:id" element={<EditReview />} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
