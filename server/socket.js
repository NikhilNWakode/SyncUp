import { Server as SocketIOServer } from "socket.io";
import Messages from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "https://syncup-frontend.onrender.com", // CORS setup for cross-origin requests
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();
 

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        io.emit("userOffline", { userId });
        break;
      }
    }
  };
  const sendNotification = (notification) => {
    const { recipentId, message } = notification;
    const recipentSocketId = userSocketMap.get(recipentId);

    if (recipentSocketId) {
      io.to(recipentSocketId).emit("receiveNotification", message);
    } else {
      console.log("Recipient is not online for real-time notification");
    }
  };

  const sendMessage = async (message) => {
    const { sender, content, messageType, fileUrl, recipent } = message;

    if (messageType === "text" && !content) {
      console.error("Content is required for text messages.");
      return;
    }
    if (messageType === "file" && !fileUrl) {
      console.error("File URL is required for file messages.");
      return;
    }

    const createdMessage = await Messages.create({
      sender,
      recipent,
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    const messageData = await Messages.findById(createdMessage._id)
      .populate("sender", "id firstName email lastName image color")
      .populate("recipent", "id firstName email lastName image color");

    const recipentSocketId = userSocketMap.get(message.recipent);
    const senderSocketId = userSocketMap.get(message.sender);

    if (recipentSocketId) {
      io.to(recipentSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
    const notificationMessage = `${sender.email} sent you a message`;
    sendNotification({
      recipentId: recipent,
      message: notificationMessage,
    });
  };

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    if (!channelId) {
      console.error("Channel ID is required to send a channel message.");
      return;
    }

    const createdMessage = await Messages.create({
      sender,
      recipent: null,
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    const messageData = await Messages.findById(createdMessage._id).populate(
      "sender",
      "id email firstName lastName image color"
    );

    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      { $push: { messages: createdMessage._id } },
      { new: true }
    ).populate("members");

    if (!updatedChannel) {
      console.error("Channel not found.");
      return;
    }

    const finalData = { ...messageData._doc, channelId: updatedChannel._id };

    updatedChannel.members.forEach((member) => {
      const memberSocketId = userSocketMap.get(member._id.toString());
      if (memberSocketId) {
        io.to(memberSocketId).emit("receive-channel-message", finalData);
      }
    });

    const adminSocketId = userSocketMap.get(
      updatedChannel.admin._id.toString()
    );
    if (adminSocketId) {
      io.to(adminSocketId).emit("receive-channel-message", finalData);
    }
  };

 
  // Register new event listeners for audio and video calls
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      io.emit("userOnline", { userId }); //notify others  this user is online
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("UserId not provided during connection.");
    }

    // Listen for message events
    socket.on("sendMessage", sendMessage);
    socket.on("send-Channel-Message", sendChannelMessage);

    socket.on("disconnect", () => {
      disconnect(socket);
      io.emit("userOffline", { userId });
    });
  });
};

export default setupSocket;
