import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MdOutlineFileDownload } from "react-icons/md";
import FileViewer from "react-file-viewer";

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
    return <div className="text-red-500">{error}</div>;
  }

  if (!fileData) {
    return <div>No file available to preview.</div>;
  }

  const downloadFile = async (file) => {
    try {
      let finalName = "";
      const fileType = file.fileType;
      const fileName = file.name.trim();

      const mimeExtensions = {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
        // Add more MIME types and extensions as needed
      };

      if (mimeExtensions[fileType]) {
        finalName = `${fileName}.${mimeExtensions[fileType]}`;
      } else {
        const fileTypeParts = fileType.split("/");
        finalName = `${fileName}.${fileTypeParts[1]}`;
      }

      setName(finalName);

      const response = await axios.get(
        `${backendUrl}/file/download?url=${encodeURIComponent(file.url)}&name=${finalName}`,
        { responseType: "blob" }
      );

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

  // Determine file type for react-file-viewer
  const getFileType = () => {
    const fileType = fileData.fileType.split("/")[1];
    return fileType;
  };

  return (
    <div className="z-50 flex justify-center items-center text-center">
      <div className="mb-4 p-4 md:mb-6 md:p-6 border border-gray-300 rounded-lg dark:border-gray-600 shadow-lg dark:shadow-gray-800 bg-white dark:bg-gray-900">
        <div className="mb-4">
          <FileViewer
            fileType={getFileType()}
            filePath={fileData.url}
            errorComponent={<div>Error loading file preview</div>}
          />
        </div>

        <h1>{name}</h1>

        <button onClick={() => downloadFile(fileData)}>
          <MdOutlineFileDownload className="text-blue-500 text-2xl md:text-3xl hover:text-blue-600 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

export default Preview;