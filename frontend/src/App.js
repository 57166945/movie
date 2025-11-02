import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import AddEditReview from './pages/AddEditReview';
import Profile from './pages/Profile';
import About from './pages/About';

function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/search" element={<Search/>} />
          <Route path="/movie/:id" element={<MovieDetail/>} />
          <Route path="/add-review/:movieId" element={<AddEditReview/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/about" element={<About/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
