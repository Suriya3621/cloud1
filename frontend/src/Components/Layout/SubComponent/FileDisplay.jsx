import React, { useState, useEffect } from "react";
import { IoMdOpen } from "react-icons/io";
import { MdDelete, MdOutlineFileDownload } from "react-icons/md";
import { FaRegEdit, FaShare } from "react-icons/fa";
import deleteFile from "./Filemanage";
import { useDispatch } from "react-redux";
import { setReload } from "../../../Slice/Reload";

// Utility function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
};

// ReadDelete Component
function ReadDelete({ file, update, reload }) {
  const dispatch = useDispatch();

  const deleteData = async () => {
    await deleteFile(file);
    dispatch(setReload(true));
    if (reload) reload(); // Trigger reload if the function is passed
  };

  return (
    <div className="flex border-2 p-2 rounded-3xl bg-slate-100 dark:bg-slate-700 shadow-lg dark:border-slate-600 space-x-2 justify-between mt-2">
      <button onClick={update}>
        <FaRegEdit className="text-blue-500 text-2xl md:text-3xl hover:text-blue-700 cursor-pointer" />
      </button>
      <button onClick={deleteData}>
        <MdDelete className="text-red-500 text-2xl md:text-3xl hover:text-red-700 cursor-pointer" />
      </button>
      <MdOutlineFileDownload className="text-blue-500 text-2xl md:text-3xl hover:text-blue-600 cursor-pointer" />
      <FaShare className="text-blue-500 text-2xl md:text-3xl hover:text-blue-600 cursor-pointer" />
      <IoMdOpen className="text-gray-400 text-2xl md:text-3xl hover:text-black dark:text-gray-300 cursor-pointer" />
    </div>
  );
}

// FileDisplay Component
function FileDisplay({ fileData, reload }) {
  const [editingFileId, setEditingFileId] = useState(null);
  const [nameInputs, setNameInputs] = useState({});

  useEffect(() => {
    const initialInputs = fileData.reduce((acc, file) => {
      acc[file.id] = file.name;
      return acc;
    }, {});
    setNameInputs(initialInputs);
  }, [fileData]);

  const handleUpdate = (fileId) => {
    setEditingFileId(editingFileId === fileId ? null : fileId);
  };

  const handleNameChange = (e, fileId) => {
    setNameInputs({
      ...nameInputs,
      [fileId]: e.target.value,
    });
  };

  const handleSave = (file) => {
    // Implement save logic here, for example sending updates to server
    handleUpdate(file.id); // Exit update mode after saving
  };

  if (fileData.length === 0) {
    return <p>No files available</p>; // Handle empty file list
  }

  return (
    <div className="p-2 md:p-4 grid sm:grid-cols-3 gap-4">
      {fileData.map((file) => (
        <div
          key={file.id}
          className="mb-4 p-4 md:mb-6 md:p-6 border border-gray-300 rounded-lg dark:border-gray-600 shadow-lg dark:shadow-gray-800 bg-white dark:bg-gray-900"
        >
          {/* Video Display */}
          {file.fileType.startsWith("video") && (
            <div className="mb-4 rounded overflow-x-hidden">
              <video
                src={file.url}
                controls
                className="w-full h-auto rounded-lg shadow-md"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Image Display */}
          {file.fileType.startsWith("image") && (
            <div className="mb-4">
              <img
                src={file.url}
                alt={file.name}
                className="w-full rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Audio Display */}
          {file.fileType.startsWith("audio") && (
            <div className="mb-4">
              <audio src={file.url} controls className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Conditional Update Mode */}
          {editingFileId === file.id ? (
            <div>
              <input
                type="text"
                className="bg-transparent rounded border border-gray-300 dark:border-gray-600 p-1 mb-2 w-full"
                value={nameInputs[file.id] || ''}
                onChange={(e) => handleNameChange(e, file.id)}
              />
              <button
                className="border-2 p-2 rounded-lg border-gray-100"
                onClick={() => handleSave(file)}
              >
                Save
              </button>
            </div>
          ) : (
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {file.name}
            </h3>
          )}

          {/* File Details */}
          <p className="text-gray-600 dark:text-gray-400">
            {formatDate(file.uploadDate)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {file.privates ? "Private" : "Public"}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-end">
            {file.fileSize}
          </p>

          {/* Action Buttons */}
          <ReadDelete file={file} update={() => handleUpdate(file.id)} reload={reload} />
        </div>
      ))}
    </div>
  );
}

export default FileDisplay;
