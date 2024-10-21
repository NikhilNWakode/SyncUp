import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { MdOutlineSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { userAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = userAppStore();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojipickerOpen, setEmojiPickerOpen] = useState(false);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData,
           { withCredentials: true,
            onUploadProgress: (data) => {
              setFileUploadProgress(Math.round((data.loaded / data.total) * 100));
            }
        });
  
        // Check if the response status is 200 and if there is data
        if (res.status === 200 && res.data) {
          setIsUploading(false);
          const messagePayload = {
            sender: userInfo.id,
            messageType: "file",
            content: undefined,
            fileUrl: res.data.filepath,  // Assuming `res.data.filepath` contains the file URL
            ...(selectedChatType === "Channel" && { channelId: selectedChatData._id }), // Add channelId for channel messages
            ...(selectedChatType === "contact" && { recipent: selectedChatData._id }),  // Add recipient for direct messages
          };
  
          // Emit the message through the socket
          socket.emit(
            selectedChatType === "Channel" ? "send-Channel-Message" : "sendMessage", 
            messagePayload
          );
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log({ error });
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleSendMessage = () => {
    const messageContent = message.trim();
    if (!messageContent) return;

    const messagePayload = {
      sender: userInfo.id,
      messageType: "text",
      content: messageContent,
      ...(selectedChatType === "Channel" && { channelId: selectedChatData._id }), // Include channelId for channel messages
      ...(selectedChatType === "contact" && { recipent: selectedChatData._id }),  // Include recipient for direct messages
    };

    // Emit the message through the socket
    socket.emit(
      selectedChatType === "Channel" ? "send-Channel-Message" : "sendMessage", 
      messagePayload
    );
    console.log("Message sent:", messagePayload);

    setMessage('');
  };

  return (
    <div className="bg-[#1c1b25] p-4 flex items-center justify-center gap-4">
      <div className="flex flex-1 bg-[#2a2b33] rounded-md items-center gap-3 pr-3">
        <input
          type="text"
          className="flex-1 py-3 px-4 bg-transparent rounded-md focus:outline-none"
          placeholder="Type your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button
          className="text-neutral-500 focus:outline-none hover:text-white transition-colors duration-300"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-xl" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
        <div className="relative">
          <button
            className="text-neutral-500 focus:outline-none hover:text-white transition-colors duration-300"
            onClick={() => setEmojiPickerOpen((prev) => !prev)}
          >
            <RiEmojiStickerLine className="text-xl" />
          </button>
          {emojipickerOpen && (
            <div ref={emojiRef} className="absolute bottom-12 w-[50px] right-60  z-10">
              <EmojiPicker
                theme="dark"
                className=""
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-full hover:bg-[#6714c6] p-3 focus:outline-none focus:ring-2 focus:ring-[#782ad1] transition-colors duration-300"
        onClick={handleSendMessage}
      >
        <MdOutlineSend className="text-xl text-white" />
      </button>
    </div>
  );
};

export default MessageBar;
