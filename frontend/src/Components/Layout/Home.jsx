import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Home.css";
import FileDisplay from './SubComponent/FileDisplay';
import { useCookies } from 'react-cookie';
import Upload from "./SubComponent/Upload";
import { useDispatch } from 'react-redux';
import { setUser } from '../../Slice/UserSlice.js'; // Correct import

function Home() {
  const [reload, setReload] = useState(false);
  const dispatch = useDispatch();
  const [uploadbtn, setUploadbtn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [data, setData] = useState({
    videoData: [],
    imageData: [],
    audioData: [],
    otherData: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookie] = useCookies(['userId']);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get(`${backendUrl}/${cookie.userId}`);
        let userData = userResponse.data.data;
        dispatch(setUser(userData));

        const response = await axios.get(`${backendUrl}/file/findfile?username=${userData.name}`);
        const files = response.data.data;

        const categorizedData = {
          videoData: files.filter(file => file.fileType.startsWith('video')),
          imageData: files.filter(file => file.fileType.startsWith('image')),
          audioData: files.filter(file => file.fileType.startsWith('audio')),
          otherData: files.filter(file => !['video', 'image', 'audio'].some(type => file.fileType.startsWith(type)))
        };

        setData(categorizedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert("Something went wrong. Please try again later.");
        alert(backendUrl)
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl, cookie.userId, reload, dispatch]);

  const handleReload = () => {
    setReload((prev) => !prev); // Toggle reload state to trigger useEffect
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const getDataForCategory = (category) => {
    let filteredData = [];
    switch (category) {
      case 'Video':
        filteredData = data.videoData;
        break;
      case 'Image':
        filteredData = data.imageData;
        break;
      case 'Audio':
        filteredData = data.audioData;
        break;
      case 'Other':
        filteredData = data.otherData;
        break;
      default:
        filteredData = [
          ...data.videoData,
          ...data.imageData,
          ...data.audioData,
          ...data.otherData
        ];
    }

    if (searchQuery) {
      filteredData = filteredData.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredData;
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const dataToDisplay = getDataForCategory(selectedCategory);

  const uploadingHandling = (uploadBox, uploadingStage) => {
    setUploadbtn(uploadBox);
    setUploading(uploadingStage);
  };

  return (
    <div>
      <br />
      <br />
      <section className="light:bg-white dark:bg-gray-900 text-slate-900 dark:text-white">
        <br />
        <header className="space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Projects</h2>
            <button
              className="hover:bg-blue-400 group flex items-center rounded-md bg-blue-700 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm dark:bg-blue-700"
            onClick={() => setUploadbtn((prev) => !prev)}
            >
              <svg width="20" height="20" fill="currentColor" className="mr-2" aria-hidden="true">
                <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
              </svg>
              Upload
            </button>
            {uploadbtn && (
              <div className="flex justify-center text-center fixed z-50 sm:left-1/3 border-2 items-center justify-center z-50 dark:bg-slate-800 bg-slate-200 dark:text-white text-black rounded-2xl w-11/12 sm:w-1/4 border-gray-400 p-4 top-1/3 h-64">
                <div className="block">
                  <button className="close" type="button" onClick={() => setUploadbtn(false)}>&#x2715; Close</button>
                  <Upload handleUploadBox={uploadingHandling} reload={handleReload} />
                </div>
              </div>
            )}
          </div>
          <form className="group relative">
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 dark:text-slate-500 pointer-events-none group-focus-within:text-blue-500"
              aria-hidden="true"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
            <input
              className="focus:ring-2 z-40 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 placeholder-slate-400 dark:placeholder-slate-500 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm dark:bg-gray-800 dark:text-white dark:ring-gray-600"
              type="text"
              aria-label="Filter projects"
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </form>
        </header>
      </section>
      <div className="dark-gray-800 h-full">
        {loading ? (
          <div className="card dark:bg-gray-800">
            <div className="header">
              <div className="img"></div>
              <div className="details">
                <span className="name"></span>
                <span className="about"></span>
              </div>
            </div>
            <div className="description">
              <div className="line line-1"></div>
              <div className="line line-2"></div>
              <div className="line line-3"></div>
            </div>
            <div className="btns">
              <div className="btn btn-1"></div>
              <div className="btn btn-2"></div>
              <div className="btn btn-2"></div>
              <div className="btn btn-2"></div>
            </div>
          </div>
        ) : (
          <>
            <nav className="flex justify-center space-x-4 bg-white dark:bg-gray-900">
              {['All', 'Image', 'Video', 'Audio', 'Other'].map((label) => (
                <button
                  key={label}
                  onClick={() => handleCategoryChange(label)}
                  className={`font-medium px-3 py-2 rounded-lg ${selectedCategory === label ? 'bg-blue-500 text-white' : 'text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-gray-700'}`}
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="content min-h-dvh bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
              <br />
              <hr />
              <FileDisplay fileData={dataToDisplay} reload={handleReload} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;