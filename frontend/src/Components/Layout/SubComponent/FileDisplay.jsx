import React from 'react';
import { IoMdOpen } from "react-icons/io";
import { MdDelete, MdOutlineFileDownload } from "react-icons/md";
import { FaRegEdit, FaShare } from "react-icons/fa";
import deleteFile from './Filemanage.js';
import { useDispatch } from 'react-redux';
import { setReload } from '../../../Slice/Reload.js'; // Correct import

function ReadDelete({ fileData, Reload }) {
  const dispatch = useDispatch();

  const deleteData = async (fileData) => {
    await deleteFile(fileData);
    dispatch(setReload(true));
    if (Reload) Reload(); // Trigger parent reload
  };

  return (
    <div className="flex border-2 p-2 rounded-3xl bg-slate-100 dark:bg-slate-700 shadow-lg dark:border-slate-600 space-x-2 justify-between mt-2">
      <button>
      <FaRegEdit className="text-blue-500 text-2xl md:text-3xl hover:text-blue-700 cursor-pointer" />
      </button>
      <button onClick={() => deleteData(fileData)}>
        <MdDelete className="text-red-500 text-2xl md:text-3xl hover:text-red-700 cursor-pointer" />
      </button>
      <MdOutlineFileDownload className="text-blue-500 text-2xl md:text-3xl hover:text-blue-600 cursor-pointer" />
      <FaShare className="text-blue-500 text-2xl md:text-3xl hover:text-blue-600 cursor-pointer" />
      <IoMdOpen className="text-gray-400 text-2xl md:text-3xl hover:text-black dark:text-gray-300 cursor-pointer" />
    </div>
  );
}

function FileDisplay({ fileData, reload }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(date);
  };

  return (
    <div className="p-2 md:p-4 grid sm:grid-cols-3 ">
      {fileData.map((file, index) => (
        <div
          key={index}
          className="mb-4 p-4 md:mb-6 md:p-6 border border-gray-300 rounded-lg dark:border-gray-600 shadow-lg dark:shadow-gray-800 bg-white dark:bg-gray-900"
        >
          {file.fileType.startsWith('video') && (
            <div className="mb-4 rounded overflow-x-hidden">
              <video src={file.url} controls className="w-full h-auto rounded-lg shadow-md">
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {file.fileType.startsWith('image') && (
            <div className="mb-4">
              <img src={file.url} alt={file.name} className="w-full rounded-lg shadow-md" />
            </div>
          )}

          {file.fileType.startsWith('audio') && (
            <div className="mb-4">
              <audio src={file.url} controls className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {file.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{formatDate(file.uploadDate)}</p>
          <p className="text-gray-600 dark:text-gray-400">{file.privates}</p>
          <p className="text-gray-600 dark:text-gray-400 text-end">{file.fileSize}</p>
          <ReadDelete fileData={file} Reload={reload} />
        </div>
      ))}
    </div>
  );
}

export default FileDisplay;