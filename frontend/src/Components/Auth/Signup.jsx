import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GrFormViewHide } from 'react-icons/gr';
import { IoEyeSharp } from 'react-icons/io5';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../App/Firebase.js';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null); // State to hold the avatar file
  const [, setCookie] = useCookies(['userId']);
  const cookieDays = 30;

  const handleChange = (e) => {
  if (e.target.name === 'avatar') {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) { // Check if file is larger than 5MB
      setError('File size should be less than 5MB');
    } else {
      setAvatarFile(file); // Set the avatar file if valid
      setError('');
    }
  } else {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user starts typing
  }
};

// Updated handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateEmail(formData.email)) {
    setError('Invalid email format');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post(`${backendUrl}/createuser`, {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    
    if (response.data.success) {
      let id = response.data.data._id;
      setCookie('userId', id, { path: '/', maxAge: cookieDays * 24 * 60 * 60 });

      // Function to handle avatar upload
      const uploadAvatar = async () => {
        if (avatarFile) {
          try {
            const avatarRef = ref(storage, `avatars/${id}/${avatarFile.name}`);
            await uploadBytes(avatarRef, avatarFile);
            const avatarUrl = await getDownloadURL(avatarRef);
console.log(avatarUrl)
            // Update backend with avatar URL
            await axios.put(`${backendUrl}/${id}`, { avatar: avatarUrl });
          } catch (error) {
            console.error('Error uploading avatar:', error);
            setError('Failed to upload avatar. Please try again later.');
          }
        }
      };

      await uploadAvatar(); // Call the uploadAvatar function

      setError(''); // Clear any errors
      alert('Sign-up successful!'); // Provide feedback to the user
    }
  } catch (error) {
    if (error.response?.data?.code === 11000) {
      setError('This email is already registered.');
    } else {
      setError(error.response?.data?.message || 'An error occurred during sign-up');
    }
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  return (
    <div className="flex auth min-h-full justify-center flex-1 flex-col justify-center dark:bg-slate-800 dark:text-white px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="signup-box dark:bg-slate-700 bg-slate-300 rounded-3xl p-10">
          <h2 className="mt-10 text-center dark:text-white text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up for an account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm dark:text-white font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name.trim()}
                  onChange={handleChange}
                  className="block w-full dark:bg-gray-700 dark:border-slate-400 border-sky-800 shadow-sm rounded-md focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Name"
                  minLength={2}
                  maxLength={20}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium dark:text-white leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email.trim()}
                  onChange={handleChange}
                  className="block dark:border-slate-400 w-full dark:bg-gray-700 border-sky-800 shadow-sm rounded-md focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block dark:text-white text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2 flex">
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="px-4 dark:border-slate-400 inline-flex dark:bg-gray-700 border-black items-center min-w-fit rounded-s-md border border-e-0 bg-gray-50 text-sm text-gray-500"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <GrFormViewHide /> : <IoEyeSharp />}
                </button>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password.trim()}
                  onChange={handleChange}
                  className="dark:bg-gray-700 dark:border-slate-400 block w-full border-sky-800 shadow-sm rounded-e-lg focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Password"
                  placeholder="******"
                  minLength={6}
                  maxLength={6}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm dark:text-white font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2 flex">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword.trim()}
                  onChange={handleChange}
                  className="block w-full dark:border-slate-400 dark:bg-gray-700 border-sky-800 shadow-sm rounded-md focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Confirm Password"
                  placeholder="******"
                  minLength={6}
                  maxLength={6}
                />
              </div>
            </div>

            {error ? (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col items-center justify-center mt-4">
              <label
                htmlFor="avatar"
                className="border-2 border-dashed border-gray-400 rounded-lg p-4 bg-gray-100 dark:bg-gray-600 text-center cursor-pointer"
              >
                <span className="text-sm text-gray-500 dark:text-gray-300">Click to select an image</span>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  className="w-10/12"
onChange={handleChange}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">File size should be less than 5MB</p>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-3xl bg-violet-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violet-800 hover:outline-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-10" />
  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-white" />
</svg>
                  ) :null}
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}