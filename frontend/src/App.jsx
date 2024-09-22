import React, { useEffect, useCallback } from 'react';
import './App.css';
import Navbar from "./Pages/Layout/Navbar";
import Settings from "./Pages/Layout/Settings";
import Home from "./Pages/Layout/Home";
import Contact from "./Pages/Layout/Contact";
import Footer from "./Pages/Layout/Footer";
import Preview from "./Pages/Layout/SubComponent/Preview";
import Login from "./Pages/Auth/Login";
import Profile from "./Pages/Auth/Profile";
import Signup from "./Pages/Auth/Signup";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import About from "./Pages/Layout/About";
import Dashboard from './Pages/Admin/Dashboard';
import { useDispatch } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
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

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
function App() {
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
      console.log(error)
    }
  }, [backendUrl, cookies.userId, dispatch]);

  useEffect(() => {
    if (cookies.userId) {
      fetchUser();
    }
  }, [cookies.userId, fetchUser]); // fetchUser is now safe to include in the dependency array

  return (
    <div>
      <Navbar />
      <hr />
      <br />
      <br />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/signup" element={<RedirectRoute element={Signup} />} />
        <Route path="/login" element={<RedirectRoute element={Login} />} />
        <Route path="/forgot-password" element={<RedirectRoute element={ForgotPassword} />} />
        <Route path="/resetpassword/:token" element={<RedirectRoute element={ResetPassword} />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/:id" element={<Preview />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
      <br />
      <br />
      <br />
      <br />

      <Footer />
    </div>
  )
}
export default App;