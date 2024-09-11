import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, Navigate ,Link} from 'react-router-dom';
import { TiSocialAtCircular } from "react-icons/ti";
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
import Settings  from "./Components/Layout/Settings"
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import Social from "./Components/Layout/Social"
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
        <Route path="/chat" element={<ProtectedRoute element={Chat} />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/open/:id" element={<Preview />} />
        <Route path="/public/social-view" element={<Social />} />
      </Routes>
    <Link to="/public/social-view" >
    <div className="bg-slate-50 text-3xl p-5 fixed right-2 bottom-10 z-50 w-fit h-fit rounded-full">
    <TiSocialAtCircular />
    </div>
    </Link>
    </div>
    )
}
export default App;