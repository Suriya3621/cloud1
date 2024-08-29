import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import Navbar from './Components/Layout/Navbar';
import Home from "./Components/Layout/Home";
import About from "./Components/Layout/About";
import Contact from "./Components/Layout/Contact";
import Preview from "./Components/Layout/SubComponent/Preview";
import Chat from "./Components/Chats/Chat.jsx";
import Profile from "./Components/Auth/Profile"
import axios from 'axios';
import { setUser } from './Slice/UserSlice.js';


const ProtectedRoute = ({ element: Element, ...rest }) => {
  const [cookies] = useCookies(['userId']);
  const isLoggedIn = Boolean(cookies.userId);

  return isLoggedIn ? <Element {...rest} /> : <Navigate to="/login" />;
};

const RedirectRoute = ({ element: Element, ...rest }) => {
  const [cookies] = useCookies(['userId']);
  const isLoggedIn = Boolean(cookies.userId);

  return !isLoggedIn ? <Element {...rest} /> : <Navigate to="/home" />;
};

function App() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [cookies] = useCookies(['userId']);

  // Memoize fetchUser to prevent it from being recreated on each render
  const fetchUser = useCallback(async () => {
    try {
      const userResponse = await axios.get(`${backendUrl}/${cookies.userId}`);
      const userData = userResponse.data.data;
      dispatch(setUser(userData));
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, [backendUrl, cookies.userId, dispatch]);

  useEffect(() => {
    if (cookies.userId) {
      fetchUser(); // Safe to call it now since it's memoized
    }
  }, [cookies.userId, fetchUser]); // fetchUser is now safe to include in the dependency array

  return (
    <>
      <Navbar />
      <hr />
      <br />
      <br />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/signup" element={<RedirectRoute element={Signup} />} />
        <Route path="/login" element={<RedirectRoute element={Login} />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
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