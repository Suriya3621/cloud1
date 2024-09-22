import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { FaEdit, FaSave, FaTrashAlt } from "react-icons/fa";
import { CSSTransition } from 'react-transition-group';
import { getStorage,listAll , deleteObject, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Profile = () => {
  const [cookies,,removeCookie] = useCookies(['userId']);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

    const storage = getStorage();
  const uploadAvatar = async () => {
    if (!avatarFile) return null;


    // Delete the old avatar if it exists
    if (userData.avatar) {
      try {
        const oldAvatarRef = ref(storage, userData.avatar); // Reference old avatar by URL
        await deleteObject(oldAvatarRef);
        console.log('Old avatar deleted successfully.');
      } catch (error) {
        if (error.code !== 'storage/object-not-found') {
          console.error('Error deleting old avatar:', error);
        }
      }
    }

    // Upload the new avatar
    const storageRef = ref(storage, `avatars/${cookies.userId}`);
    const uploadTask = uploadBytesResumable(storageRef, avatarFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error("Failed to upload avatar:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Return new avatar URL
          });
        }
      );
    });
  };

const handleSave = async () => {
    setIsSaving(true);
    try {
      let avatarUrl = userData.avatar;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(); // Upload new avatar after deletion
      }

      const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/${cookies.userId}`, {
        ...editData,
        avatar: avatarUrl
      });

      setUserData(data.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update user data:', err);
    } finally {
      setIsSaving(false);
    }
  };

const handleDelete = async () => {
  setIsSaving(true);
  const userFolderRef = ref(storage, `uploads/${cookies.userId}`); // Reference to the user's folder

  try {
    // Delete the user data from the backend
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/${cookies.userId}`);

    // Delete all files in the user's folder
    const listResult = await listAll(userFolderRef);
    const deletePromises = listResult.items.map((fileRef) => deleteObject(fileRef));
    await Promise.all(deletePromises);

    // Optionally delete the avatar file if stored in a separate location
    const avatarRef = ref(storage, `avatars/${cookies.userId}`);
    await deleteObject(avatarRef);

    // Redirect the user after deletion
    removeCookie('userId', { path: '/' });
  } catch (err) {
    console.error('Failed to delete user account:', err);
    setError('Failed to delete your account. Please try again.');
  } finally {
    setIsSaving(false);
  }
};
  if (isLoading) return <div className="flex items-center justify-center dark:text-white text-4xl h-screen">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <CSSTransition in={isMounted} timeout={300} classNames="fade" unmountOnExit>
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md transition-transform transform-gpu scale-95 hover:scale-100 duration-300 ease-out">
            <div className="flex flex-col items-center">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt={`${userData.name}'s avatar`}
                  className="w-28 h-28 rounded-full shadow-lg mb-4"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-300 dark:bg-gray-700 mb-4 flex items-center justify-center">
                  <span className="text-white">No Avatar</span>
                </div>
              )}

              {isEditing ? (
                <div className="w-full dark:text-white">
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
                    type="file"
                    name="avatar"
                    onChange={handleAvatarChange}
                    className="w-full p-2 rounded-lg mb-4 border dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    className={`w-full flex items-center justify-center gap-2 py-2 ${isSaving ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg shadow-md transition duration-300 text-center`}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving && (
                      <svg className="animate-spin h-5 w-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-10" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-white" />
                      </svg>
                    )}
                    <FaSave className="text-lg" />
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{userData.name}</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{userData.email}</p>
                  <div className="mt-6 flex w-full">
                    <button
                      className="w-full flex justify-center gap-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition duration-300 text-center"
                      onClick={() => setIsEditing(true)}
                    >
                      <FaEdit className="text-lg" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </>
              )}
              <div className="mt-4 w-full">
                <button
                  className="w-full flex justify-center gap-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition duration-300 text-center"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isSaving}
                >
                  <FaTrashAlt className="text-lg" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
<div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  {isSaving && (
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-10" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-red-500" />
                    </svg>
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </CSSTransition>
  );
};

export default Profile;