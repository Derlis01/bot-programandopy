import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import './ChatBot.css'
import { BsFillChatSquareFill } from 'react-icons/bs'
import { RiFindReplaceFill } from 'react-icons/ri'

const ChatBot = () => {
  return (
    <div>
      <div className="flex chat-container w-full shadow-lg">
        <div className="sidebar bg-gray-800 text-gray-100 py-4 px-6 overflow-hidden">
          <h1 className="text-lg font-bold mb-4">Mini-Bootcamp</h1>
          <div>
            <Link
              className="flex items-center mb-5 py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-500 cursor-pointer"
              to={'/'}>
              <div className="mr-2 mt-1">
                <BsFillChatSquareFill />
              </div>
              Chat
            </Link>
          </div>
          <div>
            <Link
              className="flex items-center mb-5 py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-500 cursor-pointer"
              to={'/code'}>
              <div className="mr-2 mt-1">
                <RiFindReplaceFill />
              </div>
              Analyze
            </Link>
          </div>
        </div>
        <div className="chat bg-gray-900 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default ChatBot
