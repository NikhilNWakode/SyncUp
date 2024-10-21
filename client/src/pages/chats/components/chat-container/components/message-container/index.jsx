import { userAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { getColor } from "@/utils/colors";
import apiClient from "@/lib/api-client";
import { MdFolderZip } from "react-icons/md";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { AvatarFallback,Avatar,AvatarImage } from "@/components/ui/avatar";


const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatMessages,
    selectedChatData,
    setSelectedChatMessages,
    userInfo,
  

  } = userAppStore();

  const [showImage,setShowImage] = useState(null);
  const [imageUrl,setImageUrl] = useState(null);
 


  useEffect(() => {
    const getMessages = async () => {
      try {
        console.log("Fetching messages for:", selectedChatData._id);
        const res = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        console.log("Response:", res.data);
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
          console.log("Messages set:", res.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        console.log("Calling getMessages");
        getMessages();
      } else {
        console.log("Not calling getMessages, selectedChatType:", selectedChatType);
      }
    } else {
      console.log("No selectedChatData._id");
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    if (!filePath || typeof filePath !== "string") {
      return false;  // Return false if filePath is empty or not a string
    }
  
    const imageRegex = /\.(jpg|jpeg|png|webp|bmp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    

      const res = await apiClient.get(`${HOST}${url}`,
        {responseType:"blob",
         
        }
      ) 
      const urlBlob = window.URL.createObjectURL(new Blob ([res.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download",url.split("/").pop());
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);

  };
  

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "Channel" && renderChannelMessages(message) }
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
        className={`${
          message.sender !== selectedChatData._id
            ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-[30px_5px_30px_30px] border-[2px] border-purple-600 shadow-lg"
            : "bg-white text-gray-800 rounded-[5px_30px_30px_30px] border-[2px] border-purple-200 shadow-md"
      } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {
  message.messageType === "file" && (
    <div
      className={`${
        message.sender !== selectedChatData._id
          ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-[30px_5px_30px_30px] border-[2px] border-purple-600 shadow-lg"
          : "bg-white text-gray-800 rounded-[5px_30px_30px_30px] border-[2px] border-purple-200 shadow-md"
      }  inline-block p-4 rounded my-1 max-w-[50%] break-words`}
    >
      {message.content}
      {console.log(`messages from content:${message.fileUrl}`)}
      {checkIfImage(message.fileUrl) ? (
        <div className="cursor-pointer  "
        onClick={()=>{
          setShowImage(true);
          setImageUrl(message.fileUrl)
        }}>
          <img src={`${HOST}${message.fileUrl}`} alt="image"  className="object-contain rounded-sm h-[300px] w-[300px] "   />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 mt-2">
        <span className="text-2xl bg-black/10 rounded-full p-2">
          <MdFolderZip />
        </span>
        <span className="flex-grow truncate">{message.fileUrl.split("/").pop()}</span>
        <span
          className="bg-black/10 p-2 text-xl rounded-full hover:bg-black/20 cursor-pointer transition-all duration-300"
          onClick={() => downloadFile(message.fileUrl)}
        >
          <FaArrowAltCircleDown />
        </span>
      </div>
      )}
    </div>
  )
}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessages = (message) => {
    console.log(userInfo.id);
    console.log(message.sender._id);
    console.log(userInfo.id);
    return (
      <div className={`mt-5 ${
        message.sender._id !== userInfo.id ? "text-left" : "text-right"
      }`}>
        {console.log(message)}
        {message.messageType === "text" && (
        <div
        className={`${
          message.sender._id === userInfo.id
            ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-[30px_5px_30px_30px] border-[2px] border-purple-600 shadow-lg"
            : "bg-white text-gray-800 rounded-[5px_30px_30px_30px] border-[2px] border-purple-200 shadow-md"
      } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {
        message.sender._id !== userInfo.id ? 
        (<div className="flex items-center justify-start gap-3"  >
           <Avatar className="h-8 w-8  rounded-full overflow-hidden">
                      {message.sender.image && (
                        <AvatarImage
                          src={`${HOST}${message.sender.image}`}
                          alt="profile"
                          className="w-full h-full rounded-full bg-black object-cover"
                        />
                      ) } 
                        <AvatarFallback
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-lg  uppercase ${getColor(
                            message.sender.color
                          )}`}
                        >
                        {message.sender.firstName ? message.sender.firstName.split("").shift() : message.sender.email.split("").shift()}
                        </AvatarFallback>
                      
                    </Avatar>
                    <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
                    <span className="text-xs text-white/60">{
                      moment(message.timestamp).format("LT")
                    } </span>
        </div>) : 
        (<div>
        <span className="text-xs mt-2 text-white/60">{
          moment(message.timestamp).format("LT")
        } </span>
        </div>)
      }
      {
        message.messageType === "file"  && (
          message.messageType === "file" && (
            <div
              className={`${
                message.sender._id !== userInfo.id
                  ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-[30px_5px_30px_30px] border-[2px] border-purple-600 shadow-lg"
                  : "bg-white text-gray-800 rounded-[5px_30px_30px_30px] border-[2px] border-purple-200 shadow-md"
              }  inline-block p-4 rounded my-1 max-w-[50%] break-words`}
            >
              {message.content}
              {console.log(`messages from content:${message.fileUrl}`)}
              {checkIfImage(message.fileUrl) ? (
                <div className="cursor-pointer  "
                onClick={()=>{
                  setShowImage(true);
                  setImageUrl(message.fileUrl)
                }}>
                  <img src={`${HOST}${message.fileUrl}`} alt="image"  className="object-contain rounded-sm h-[300px] w-[300px] "   />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 mt-2">
                <span className="text-2xl bg-black/10 rounded-full p-2">
                  <MdFolderZip />
                </span>
                <span className="flex-grow truncate">{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/10 p-2 text-xl rounded-full hover:bg-black/20 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <FaArrowAltCircleDown />
                </span>
              </div>
              )}
            </div>
          )
        )
      }

      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" >
     <div className="flex-grow overflow-y-auto p-4 px-8">
        <h2 className="mb-4 text-xl font-semibold">MessageContainer</h2>
        {selectedChatMessages.length > 0 ? renderMessages() : <p>No messages to display.</p>}
        <div ref={scrollRef} />
        {showImage && (
  <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center 
    backdrop-blur-lg flex-col">
    <div>
      <img 
        src={`${HOST}${imageUrl}`} 
        alt="Image" 
        className="max-h-[80vh] w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] 
        xl:max-w-[50vw] object-contain" 
      />
    </div>
    <div className="flex gap-5 fixed top-0 mt-5">
      <button 
        className="bg-black/10 p-2 text-xl rounded-full hover:bg-black/20 
        cursor-pointer transition-all duration-300" 
        onClick={() => downloadFile(imageUrl)}
      >
        <FaArrowAltCircleDown />
      </button>
      <button 
        className="bg-black/10 p-2 text-xl rounded-full hover:bg-black/20 
        cursor-pointer transition-all duration-300" 
        onClick={() => {
          setImageUrl(null);
          setShowImage(false);
          
        }}
      >
        <IoMdClose />
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default MessageContainer;