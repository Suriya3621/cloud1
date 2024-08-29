import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Profile() {
  const [cookies] = useCookies(['userId']);
  const [userData,setUserData] =useState({})

  useEffect(() => {
  const FetchUser = async () => {
    try {
      let response = await axios.get(`${backendUrl}/${cookies.userId}`);
      setUserData(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };
    if (cookies.userId) {
      FetchUser();
    }
  }, [cookies.userId]);

  return (
    <div className="dark:text-white text-black">
      <br />
        <div className="w-11/12 z-0 rounded-full absolute h-1/2 bg-red-700">
        </div>
      <center>
      <div className="border-2 p-1 z-20 border-slate-300 w-10/12">
        <div className="flex justify-center items-center text-center">
          <img src={userData.avatar} alt={userData.name} className="w-1/2" />
        </div>
        <div className="text-center text-5xl">
          <h1>{userData.name}</h1>
        </div>
      </div>
      </center>
    </div>
  );
}