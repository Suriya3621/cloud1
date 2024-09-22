import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../../App/Firebase.jsx";
import axios from "axios";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

export const deleteFile = async (filePath) => {
  console.log("File path for deletion:", filePath);

  // Create a reference to the file to delete
  const fileRef = ref(storage, filePath.url);
  try {
    // Delete the file from Firebase Storage
    const response = await axios.delete(`${backendUrl}/file/delete/${filePath._id}`);
    console.log("Backend response:", response.data);
    await deleteObject(fileRef);
    console.log("File deleted from Firebase Storage successfully.");
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export const updateFile = async (fileId, updatedData) => {
  try {
    console.log(fileId)
    console.log(updatedData)
    const response = await axios.put(`${backendUrl}/file/update/${fileId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
};