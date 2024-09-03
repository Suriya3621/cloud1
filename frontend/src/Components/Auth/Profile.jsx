import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { FaEdit, FaSave } from "react-icons/fa";
import { CSSTransition } from 'react-transition-group';

const Profile = () => {
  const [cookies] = useCookies(['userId']);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!cookies.userId) {
        setError('No user ID found.');
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/${cookies.userId}`);
        setUserData(data.data);
        setEditData({
          name: data.data.name,
          email: data.data.email,
          avatar: data.data.avatar
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user data.');
      } finally {
        setIsLoading(false);
        setIsMounted(true);
      }
    };

    fetchUser();
  }, [cookies.userId]);

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/${cookies.userId}`, editData);
      setUserData(data.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update user data:', err);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <CSSTransition
      in={isMounted}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md transition-transform transform-gpu scale-95 hover:scale-100 duration-300 ease-out">
          <div className="flex flex-col items-center">
            <img
              src={userData.avatar}
              alt={`${userData.name}'s avatar`}
              className="w-32 h-28 rounded-full shadow-lg mb-4"
            />
            {isEditing ? (
              <div className="w-full">
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg mb-4 border dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg mb-4 border dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  name="avatar"
                  value={editData.avatar}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg mb-4 border dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Avatar URL"
                />
                <button
                  className="w-full flex items-center justify-center gap-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition duration-300 text-center"
                  onClick={handleSave}
                >
                  <FaSave className="text-lg" />
                  <span>Save Changes</span>
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{userData.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{userData.email}</p>
                <div className="mt-6 flex">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition duration-300 text-center"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit className="text-lg" />
                    <span>Edit Profile</span>
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-2 bg-red-500 text-white rounded-lg shadow-md transition duration-300 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Profile;