import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../../App/Firebase.js";
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const deleteFile = async (filePath) => {
  console.log('File path for deletion:', filePath);

  // Create a reference to the file to delete
  const fileRef = ref(storage, filePath.url);
  try {
    // Delete the file from Firebase Storage
    const response = await axios.delete(`${backendUrl}/file/delete/${filePath._id}`);
    console.log('Backend response:', response.data);
    await deleteObject(fileRef);
    console.log("File deleted from Firebase Storage successfully.");

    // Send a DELETE request to the backend
  
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};
const updateFile =async(filePath,data)=>{
  console.log('File path for deletion:', filePath);
  try {
    const response = await axios.put(`${backendUrl}/file/update/${filePath._id}`,data);
    console.log('Backend response:', response.data);
  } catch (error) {
    console.error("Error editing file:", error);
  }
}
export default deleteFile;