import { userAppStore } from "@/store";
import { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";
import { HOST } from "@/utils/constants";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo,addNotification,setUserStatus } = userAppStore();
 

  useEffect(() => {
    if (userInfo) {
      // Initialize socket connection
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
        socket.current.emit("userOnline",{ userId: userInfo.id});
      });

      socket.current.on("userOnline", (data) => {
        console.log(`${data.userId} is online`);
        setUserStatus(data.userId, true);
      });

      // Listen for offline users
      socket.current.on("userOffline", (data) => {
        console.log(`${data.userId} is offline`);
        setUserStatus(data.userId, false);
      });

      

      // Handle incoming direct messages
      const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          userAppStore.getState();
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipent._id)
        ) {
          addMessage(message);
          console.log("Message received:", message);
        } else {
          console.log("Message not relevant for the current chat.");
        }
      };

      // Handle incoming channel messages
      const handleReceiveChannelMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          userAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message);
        }
      };
        // Listen for real-time notifications
        socket.current.on("receiveNotification", (message) => {
            console.log("Notification received:", message);
            addNotification(message); // This is your function to handle state changes in your app
          });
  
      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);

      // Error handling for socket connection
      socket.current.on("error", (error) => {
        console.error("Socket error:", error);
      });

      // Cleanup on component unmount
      return () => {
        socket.current.emit("userOffline", { userId: userInfo.id});
        socket.current.disconnect();
      };
    }
  }, [userInfo,addNotification,setUserStatus,socket]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
