import { userAppStore } from '@/store';
import React from 'react';
import {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatContainer from './components/chat-container';
import EmptyChatContainer from './components/empty-chat-container';
import ContactContainer from './components/contacts-container';
import { Divide } from 'lucide-react';


const Chat = () => {
  const { userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,

   } = userAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && !userInfo.profileSetup) {
      toast('Please setup your profile to continue.');
      navigate('/profile-setup');
    }
  }, [userInfo,navigate]);


  return (
    <div className='flex h-[100vh] text-white overflow-hidden' >
      {
        isUploading && (
          <div className='flex h-[100vh] w-[100vw] top-0 left-0 z-10 bg-black/80  items-center justify-center flex-col gap-5 backdrop-blur-lg'>
            <h1 className='text-5xl animate-pulse'>Uploading File</h1>
            {fileUploadProgress}%
          </div>
        )
      }
      {
        isDownloading  && (
          <div className='flex h-[100vh] w-[100vw] top-0 left-0 z-10 bg-black/80  items-center justify-center flex-col gap-5 backdrop-blur-lg'>
            <h1 className='text-5xl animate-pulse'>Downloading File</h1>
            {fileDownloadProgress}%
          </div>
        )
      }
      <ContactContainer/>
      {selectedChatType === undefined ? (
           <EmptyChatContainer/> 
      ): (
        <ChatContainer/>
      )
    }
      
       
    </div>
  )
}

export default Chat
