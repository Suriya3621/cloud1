import React, { useState } from 'react';
import { GrFormViewHide } from "react-icons/gr";
import { IoEyeSharp } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useCookies } from 'react-cookie';
import "../Styles/Auth.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorCode, setErrorCode] = useState(false);
  const [password, setPassword] = useState('');
  const [, setCookie] = useCookies(['userId']);
  const navigate = useNavigate(); 
  const cookieDays = 30;
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/login`, { password });
      const userId = response.data.user._id;
      setCookie('userId', userId, { path: '/' ,maxAge: cookieDays * 24 * 60 * 60 });
      navigate('/home'); // Redirect to /home
    } catch (error) {
      console.error(error);
      setErrorCode(true);
    }
  };

  const handleForgotPassword = () => {
    // Handle password reset logic here
  };

  return (
    <div className="auth flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 dark:bg-gray-800 dark:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Cloud store"
          src="./image/cloud_login.png"
          className="mx-auto h-40 w-auto"
        />
      </div>

          <div className="mt-10 sm:mx-auto bg-slate-300 sm:w-full sm:max-w-sm dark:bg-slate-700 rounded-3xl p-10">
            <h2 className="dark:text-white mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Login to your account
            </h2>
            <br />
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block dark:text-white text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2 flex">
                  <button 
                    type="button"
                    onClick={toggleShowPassword} 
                    className="px-4 inline-flex dark:bg-slate-700 bg-slate-100 border-black dark:text-white items-center min-w-fit rounded-s-md border border-e-0 dark:border-stone-100 text-sm text-black">
                    {showPassword ? <GrFormViewHide /> : <IoEyeSharp />}
                  </button>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="block dark:bg-gray-700 w-full border-sky-800 shadow-sm rounded-e-lg focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:border-stone-100 disabled:opacity-50 disabled:pointer-events-none"
                  />
                </div>
                <br/>
                {errorCode && (
                  <div className="p-1 text-center text-red-600 border-2 rounded border-red-600 bg-red-300">
                    Incorrect password. Please try again.
                  </div>
                )}
                <div className="text-sm">
                  <button type="button" className="font-semibold text-sky-700 hover:text-sky-700" onClick={handleForgotPassword}>
                    Forgot your password?
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex shadow w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Login
                </button>
              </div>
              <div className="text-sm text-center">
                <p className="text-gray-500">
                  Don't have an account?
                  <Link to="/signup" className="font-semibold text-sky-700 hover:text-sky-900">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
    </div>
  );
}