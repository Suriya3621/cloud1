import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MdOutlineFileDownload } from "react-icons/md";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Preview() {
  const { id } = useParams();
  const [fileData, setFileData] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/file/open/${id}`);
        setFileData(response.data.file);
      } catch (err) {
        console.error(err);
        setError("Failed to load file data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
      <br />
      <h1 className="text-red-600 font-bold">
      {error}
      </h1>
      </div>
      )
  }

  if (!fileData) {
    return (
      <div>
      <br />
      <h1>
      No file available to preview.
      </h1>
      </div>
      )
  }

  const downloadFile = async (file) => {
    try {
      let finalName = "";
      const fileType = file.fileType;
      const fileName = file.name.trim();

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

      // Set the file name in the state before initiating download
      setName(finalName);

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
    <div className="z-50 flex justify-center items-center text-center">
      <div className="mb-4 p-4 md:mb-6 md:p-6 border border-gray-300 rounded-lg dark:border-gray-600 shadow-lg dark:shadow-gray-800 bg-white dark:bg-gray-900">
        {fileData.fileType.startsWith("video") && (
          <div className="mb-4 rounded overflow-x-hidden">
            <video src={fileData.url} controls className="w-full h-auto rounded-lg shadow-md">
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {fileData.fileType.startsWith("image") && (
          <div className="mb-4">
            <img src={fileData.url} alt={fileData.name} className="w-full rounded-lg shadow-md" />
          </div>
        )}

        {fileData.fileType.startsWith("audio") && (
          <div className="mb-4">
            <audio src={fileData.url} controls className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Display the file name before downloading */}
        <h1>{name}</h1>
        
        <button onClick={() => downloadFile(fileData)}>
          <MdOutlineFileDownload className="text-blue-500 text-2xl md:text-3xl hover:text-blue-600 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

export default Preview;