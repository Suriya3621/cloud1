import clsx from 'clsx';
import React,{ useState } from 'react';
import axios from "axios";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
export default function ForgotPassword() {
  const [email,setEmail] = useState("")
  const [msg,setMsg] = useState(false)
  
  const RequstToPassword = async()=>{
    if(!email){
      return alert("Please enter your Email")
    }
    try{
      axios.post(`${backendUrl}/forgotpassword`,{ email })
      setMsg(true)
    }catch(err){
      console.log(err)
    }
  }
  return (<>
      <br />
      <br />
    <div className="w-full flex justify-center items-center text-center max-w-md px-4 dark:text-white text-black">
      <div>
        <label className="text-sm font-medium ">Email</label>
        <p className="text-sm dark:text-white/50 text-black/50">
          Enter your email to reset your password
        </p>
        <input
          type="email"
          className={clsx(
            'mt-3 block w-full rounded-lg border-2 dark:text-white dark:border-none border-black bg-white/5 py-1.5 px-3 text-sm text-black',
            'focus:outline-none dark:text-white dark:border-none focus:ring-2 focus:ring-offset-2 focus:ring-white/25'
          )}
          placeholder="example@gmail.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <br />
        <button onClick={RequstToPassword} className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold hover:bg-slate-500 text-white shadow-inner shadow-white/10 focus:outline-none focus:ring-1 focus:ring-white">
          Send Email
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
</svg>

        </button>
        {msg ? (
          <>
          <p className="text-green-500">Successfully send Email ,Check your email</p>
<svg
  height="70px"
  width="70px"
  version="1.1"
  id="Capa_1"
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  viewBox="-90.57 -90.57 378.03 378.03"
  xmlSpace="preserve"
  fill="#000000"
  stroke="#000000"
  strokeWidth="8.072367"
  transform="rotate(0)"
>
  <g
    id="SVGRepo_bgCarrier"
    strokeWidth="0"
    transform="translate(0,0), scale(1)"
  >
    <rect
      x="-90.57"
      y="-90.57"
      width="378.03"
      height="378.03"
      rx="189.015"
      fill="#00ff00"
      strokeWidth="0"
    ></rect>
  </g>
  <g
    id="SVGRepo_tracerCarrier"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="#CCCCCC"
    strokeWidth="1.181322"
  ></g>
  <g id="SVGRepo_iconCarrier">
    <g>
      <polygon
        style={{ fill: '#010002' }}
        points="191.268,26.967 59.541,158.683 5.615,104.76 0,110.386 59.541,169.92 196.887,32.585"
      ></polygon>
    </g>
  </g>
</svg>          </>
          ):null
        }
      </div>
    
    </div>
  </>);
}