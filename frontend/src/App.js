import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import Navbar from './Components/Layout/Navbar';
import Home from "./Components/Layout/Home";
import About from "./Components/Layout/About";
import Contact from "./Components/Layout/Contact";
import Preview from "./Components/Layout/SubComponent/Preview";
import Chat from "./Components/Chats/chat";

// Helper component to protect routes for authenticated users
const ProtectedRoute = ({ element: Element, ...rest }) => {
  const [cookies] = useCookies(['userId']);
  const isLoggedIn = Boolean(cookies.userId);

  return isLoggedIn ? <Element {...rest} /> : <Navigate to="/login" />;
};

// Helper component to redirect authenticated users away from login/signup pages
const RedirectRoute = ({ element: Element, ...rest }) => {
  const [cookies] = useCookies(['userId']);
  const isLoggedIn = Boolean(cookies.userId);

  return !isLoggedIn ? <Element {...rest} /> : <Navigate to="/home" />;
};

function App() {
  return (
    <>
      <Navbar />
      <hr />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/signup" element={<RedirectRoute element={Signup} />} />
        <Route path="/login" element={<RedirectRoute element={Login} />} />
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route path="/chat" element={<ProtectedRoute element={Chat} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/open/:id" element={<Preview />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;