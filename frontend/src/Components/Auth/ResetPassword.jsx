import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import clsx from 'clsx';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function ResetPassword() {
  const { token } = useParams(); // Access the token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      setMsg('Passwords do not match');
      return;
    }

    try {
      console.log(`${backendUrl}/resetpassword/${token}`)
      const response = await axios.put(`${backendUrl}/resetpassword/${token}`, {
        password,
        confirmPassword
      });

      if (response.status === 200) {
        setMsg(response.data.message);
      } else {
        setMsg(response.data.message);
      }
    } catch (error) {
      console.log(error)
      setMsg('An error occurred while changing the password');
    }
  };

  return (<>
      <br />
      <br />
    <div className="w-full flex justify-center items-center text-center max-w-md px-4 dark:text-white text-black">
      <div>
        <label className="text-sm font-medium">Change password</label>
        <p className="text-sm dark:text-white/50 text-black/50">
          Don't forget this password
        </p>
        <input
          type={showPassword ? "text" : "password"}  // Toggle between text and password types
          className={clsx(
            'mt-3 block w-full rounded-lg border-2 dark:text-white dark:border-none border-black bg-white/5 py-1.5 px-3 text-sm text-black',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/25'
          )}
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type={showPassword ? "text" : "password"}  // Toggle between text and password types
          className={clsx(
            'mt-3 block w-full rounded-lg border-2 dark:text-white dark:border-none border-black bg-white/5 py-1.5 px-3 text-sm text-black',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/25'
          )}
          placeholder="Enter confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <span className="ml-2">Show Password</span>
        </label>
        <br />
        <button
          onClick={handleChangePassword}
          className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold hover:bg-slate-500 text-white shadow-inner shadow-white/10 focus:outline-none focus:ring-1 focus:ring-white"
        >
          Change password
        </button>
        {msg && (
          <div>
            <p className="text-green-500">{msg}</p>
            {msg === 'Password reset successfully' && (
              <img src="https://firebasestorage.googleapis.com/v0/b/cloud-upload12.appspot.com/o/done.png?alt=media&token=4ccf39ff-17e3-4544-8c67-279bbb2fcdcd" className="flex justify-center w-1/2 h-1/2" alt="Success" />
            )}
          </div>
        )}
      </div>
    </div>
  </>);
}