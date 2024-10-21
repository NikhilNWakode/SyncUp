import React, { useState } from 'react'; // Ensure you import useState
import ChatHeader from "./components/chat-header";
import MessageContainer from "./components/message-container";
import MessageBar from "./components/message-bar";
import WebRTCCall from "./components/call-component"; // Assuming this is the correct path

const ChatContainer = () => {
  const [isCallVisible, setIsCallVisible] = useState(false);
  const [callType, setCallType] = useState(''); 

  const handleStartCall = (type) => {
    setCallType(type);
    setIsCallVisible(true);
  };

  return (
    <div className="fixed md:static top-0 left-0 right-0 w-full h-screen md:h-auto bg-[#1c1d25] flex flex-col md:flex-1">
      {/* Pass down the onStartCall function to ChatHeader */}
      <ChatHeader onStartCall={handleStartCall} />

      <div className="flex-grow overflow-y-auto">
        <MessageContainer />
      </div>

      <MessageBar />

      {/* Conditionally render the WebRTCCall component */}
      {isCallVisible && (
        <WebRTCCall recipentId={recipentId} isAudioOnly={callType === 'audio'} />
      )}
    </div>
  );
};

export default ChatContainer;
