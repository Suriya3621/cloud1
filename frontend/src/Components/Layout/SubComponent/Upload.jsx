import React, { useState } from 'react';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../App/Firebase.js';
import { useSelector } from 'react-redux';

function Upload({ handleUploadBox, reload }) {
  const userData = useSelector((state) => state.user.value);
  const [file, setFile] = useState(null);
  const [nickname, setNickname] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [popupVisible, ] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please choose a file first!');
      return;
    }

    if (!nickname.trim()) {
      alert('Please provide a nickname!');
      return;
    }

    setUploading(true);
    handleUploadBox(false, true); // Hide upload box and show loading popup

    const fileRef = ref(storage, `uploads/${userData._id}/${Date.now()}_${file.name}`);
    try {
    let msg = "File is uploading...."
     handleUploadBox(false, true,msg); // Hide upload box and show loading popup
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      const formatFileSize = (sizeInBytes) => {
        if (sizeInBytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
        return (sizeInBytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
      };

      const fileData = {
        id: userData._id.trim(),
        name: nickname.trim() || file.name,
        url: downloadURL,
        fileSize: formatFileSize(file.size),
      };

      await axios.post(`${backendUrl}/file/uploadFile`, fileData);
      setMessage('File uploaded successfully!');
      setFile(null);
      setNickname('');
      reload();
      msg = "File uploaded successfully"
      handleUploadBox(false, true ,msg); // Hide loading popup
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file, please try again.');
    } finally {
      setUploading(false);
      let msg;
      handleUploadBox(false, false,msg); // Hide loading popup
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="upload-text">
          File Nickname
        </label>
        <input
          type="text"
          id="upload-text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mt-1 dark:text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter a nickname..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="upload-file">
          Choose File
        </label>
        <input
          type="file"
          id="upload-file"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 cursor-pointer focus:outline-none"
        />
      </div>
      <button
        onClick={handleUpload}
        className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
      {popupVisible && (
        <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-md shadow-lg flex items-center">
          <div className="loading-spinner mr-2"></div>
          <p>Uploading...</p>
        </div>
      )}
    </div>
  );
}

export default Upload;