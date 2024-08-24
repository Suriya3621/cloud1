import React, { useState, useEffect } from "react";
import { IoMdOpen } from "react-icons/io";
import { MdDelete, MdOutlineFileDownload, MdOutlinePublic } from "react-icons/md";
import { FaRegEdit, FaShare } from "react-icons/fa";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { deleteFile, updateFile } from "./Filemanage";
import { useDispatch } from "react-redux";
import { setReload } from "../../../Slice/Reload";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;


function ReadDelete({ file, update, reload }) {
  const dispatch = useDispatch();

  const deleteData = async () => {
    try {
      await deleteFile(file);
      dispatch(setReload(true));
      if (reload) reload();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const downloadFile = async () => {
    try {
      let finalName = "";
      let fileType = file.fileType;
      let fileName = file.name.trim();

      // Handle specific MIME types
      const mimeExtensions = {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
        // Add more MIME types and extensions as needed
      };

      // Determine the file extension based on the MIME type
      if (mimeExtensions[fileType]) {
        finalName = `${fileName}.${mimeExtensions[fileType]}`;
      } else {
        // Fallback for other types like images, videos, etc.
        const fileTypeParts = fileType.split("/");
        finalName = `${fileName}.${fileTypeParts[1]}`;
      }

      // Make a GET request to your backend to download the file
      const response = await axios.get(
        `${backendUrl}/file/download?url=${encodeURIComponent(file.url)}&name=${finalName}`,
        { responseType: "blob" } // Important to handle binary data
      );

      // Create a temporary link to trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", finalName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="flex border-2 p-2 rounded-3xl bg-slate-100 dark:bg-slate-700 shadow-lg dark:border-slate-600 space-x-2 justify-between mt-2">
      <button onClick={update}>
        <FaRegEdit className="text-blue-500 text-2xl md:text-3xl hover:text-blue-700 cursor-pointer" />
      </button>
      <button onClick={deleteData}>
        <MdDelete className="text-red-500 text-2xl md:text-3xl hover:text-red-700 cursor-pointer" />
      </button>
      <button onClick={downloadFile}>
        <MdOutlineFileDownload className="text-blue-500 text-2xl md:text-3xl hover:text-blue-600 cursor-pointer" />
      </button>
      <FaShare className="text-blue-500 text-2xl md:text-3xl hover:text-blue-600 cursor-pointer" />
      <IoMdOpen className="text-gray-400 text-2xl md:text-3xl hover:text-black dark:text-gray-300 cursor-pointer" />
    </div>
  );
}

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

function FileDisplay({ fileData, reload }) {
  const dispatch = useDispatch();
  const [editingFileId, setEditingFileId] = useState(null);
  const [nameInputs, setNameInputs] = useState({});

  useEffect(() => {
    const initialInputs = fileData.reduce((acc, file) => {
      acc[file._id] = { name: file.name, isPrivate: file.private };
      return acc;
    }, {});
    setNameInputs(initialInputs);
  }, [fileData]);

  const handleUpdate = (fileId) => {
    setEditingFileId(editingFileId === fileId ? null : fileId);
  };

  const handleNameChange = (e, fileId) => {
    setNameInputs((prevInputs) => ({
      ...prevInputs,
      [fileId]: { ...prevInputs[fileId], name: e.target.value },
    }));
  };

  const handleVisibilityToggle = (fileId) => {
    setNameInputs((prevInputs) => ({
      ...prevInputs,
      [fileId]: {
        ...prevInputs[fileId],
        isPrivate: !prevInputs[fileId].isPrivate,
      },
    }));
  };

  const saveData = async (fileId) => {
    try {
      const updatedData = {
        name: nameInputs[fileId]?.name || "", // Ensure default value
        private: Boolean(nameInputs[fileId]?.isPrivate),
      };
      await updateFile(fileId, updatedData);
      dispatch(setReload(true));
      reload();
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  const handleSave = (file) => {
    saveData(file._id);
    handleUpdate(file._id);
  };

  if (fileData.length === 0) {
    return <p>No files available</p>;
  }

  return (
    <div className="p-2 md:p-4 grid sm:grid-cols-3 gap-4">
      {fileData.map((file) => (
        <div
          key={file._id}
          className="mb-4 p-4 md:mb-6 md:p-6 border border-gray-300 rounded-lg dark:border-gray-600 shadow-lg dark:shadow-gray-800 bg-white dark:bg-gray-900"
        >
          {file.fileType.startsWith("video") && (
            <div className="mb-4 rounded overflow-x-hidden">
              <video src={file.url} controls className="w-full h-auto rounded-lg shadow-md">
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {file.fileType.startsWith("image") && (
            <div className="mb-4">
              <img src={file.url} alt={file.name} className="w-full rounded-lg shadow-md" />
            </div>
          )}

          {file.fileType.startsWith("audio") && (
            <div className="mb-4">
              <audio src={file.url} controls className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {editingFileId === file._id ? (
            <div>
              <input
                type="text"
                className="bg-transparent rounded border border-gray-300 dark:border-gray-600 p-1 mb-2 w-full"
                value={nameInputs[file._id]?.name || ""}
                onChange={(e) => handleNameChange(e, file._id)}
              />
              <button
                className="flex items-center mb-2 border-2 border-green-600 rounded-3xl p-2"
                onClick={() => handleVisibilityToggle(file._id)}
              >
                {nameInputs[file._id]?.isPrivate ? (
                  <>
                    <RiGitRepositoryPrivateLine className="mr-1" />
                    Private
                  </>
                ) : (
                  <>
                    <MdOutlinePublic className="mr-1" />
                    Public
                  </>
                )}
              </button>
              <button
                className="border-2 p-2 bg-gradient-to-l from-indigo-500 rounded-lg border-gray-100"
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

          <p className="text-gray-600 dark:text-gray-400">
            {formatDate(file.uploadDate)}
          </p>
          <p className="text-gray-600 dark:text-gray-400 flex items-center">
            {file.private ? (
              <>
                <RiGitRepositoryPrivateLine className="mr-1" />
                Private
              </>
            ) : (
              <>
                <MdOutlinePublic className="mr-1" />
                Public
              </>
            )}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-end">
            {file.fileSize}
          </p>

          <ReadDelete
            file={file}
            update={() => handleUpdate(file._id)}
            reload={reload}
          />
        </div>
      ))}
    </div>
  );
}

export default FileDisplay;