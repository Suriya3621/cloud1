import React from 'react';
import "./Styles/Chat.css";

let chats = [
  {
    "_id": "1",
    "type": "text",
    "avatar": "/image/defaultUser.png",
    "name": "suriya",
    "message": "hii"
  },
  {
    "_id": "2",
    "type": "text",
    "avatar": "/image/defaultUser.png",
    "name": "user1",
    "message": "hello!!"
  },
  {
    "_id": "3",
    "type": "text",
    "avatar": "/image/defaultUser.png",
    "name": "user2",
    "message": "hii guys"
  },
  {
    "_id": "4",
    "type": "text",
    "avatar": "/image/defaultUser.png",
    "name": "suriya",
    "message": "mm welcome to all guys"
  },
  {
    "_id": "5",
    "type": "text",
    "avatar": "/image/defaultUser.png",
    "name": "suri",
    "message": "ok bro"
  },
  {
    "_id": "6",
    "type": "url",
    "avatar": "/image/defaultUser.png",
    "name": "suri",
    "message": "ok bro"
  },
  {
    "_id": "7",
    "type": "url",
    "avatar": "/image/defaultUser.png",
    "name": "suriya",
    "message": "ok bro"
  },
  {
    "_id": "8",
    "type": "url",
    "avatar": "/image/defaultUser.png",
    "name": "suri",
    "message": "ok bro"
  },
];

function fileDisplay(id) {
  return (
    <div>
      <img src="./cloud-upload.png" alt="Uploaded file thumbnail" />
    </div>
  );
}

export default function Chat() {
  let UserName = "suriya";
  return (
    <div className="text-white scroll-smooth container-90">
      <br />
      <br />
      <div>
        {chats.map((value) => (
          <div key={value._id}>
            <div className={`flex ${value.name === UserName ? "justify-end" : "justify-start"}`}>
              {value.name !== UserName && (
                <img className="text-start rounded-full w-10 h-8" src={value.avatar} alt={`${value.name}'s avatar`} />
              )}
              <div className={`${value.name === UserName ? "bg-sky-500 rounded-tl-3xl" : "rounded-tr-3xl bg-gray-400"} p-1 rounded-br-3xl rounded-bl-3xl block minimum-chat-layout text-center`}>
                <p className="text-start font-bold p-0.5">{value.name === UserName ? "You" : value.name}</p>
                <hr />
                {value.type === "text" ? (
                  <div>{value.message}</div>
                ) : (
                  <div>{fileDisplay(value._id)}</div>
                )}
              </div>
              {value.name === UserName && (
                <img className="text-start rounded-full w-10 h-8" src={value.avatar} alt="Your avatar" />
              )}
            </div>
            <br />
          </div>
        ))}
        <br />
        <br />
        <div className="fixed bottom-0 h-20 left-0 w-full p-3 dark:bg-slate-800">
          <div className="h-fit w-11/12 p-2 rounded-2xl bg-red-700">
            <button className="p-2 rounded border-2 w-1/12 bg-transparent">+</button>
            <input
              className="bg-transparent outline-0 border-0 rounded-l w-11/12"
              placeholder="Type a message..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}