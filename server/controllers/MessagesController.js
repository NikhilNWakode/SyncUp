import Messages from "../models/MessagesModel.js";
import  { mkdirSync,renameSync } from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;  // Set by verifyToken middleware
    const user2 = req.body.id;  // ID sent from the client

    if (!user1 || !user2) {
      return res.status(400).json({ message: "Both User IDs are required" });
    }

    console.log("User1 ID:", user1);
    console.log("User2 ID:", user2);

    const messages = await Messages.find({
      $or: [
        { sender: user1, recipent: user2 },
        { sender: user2, recipent: user1 }
      ]
    }).sort({ timestamp: 1 });

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found between users." });
    }

    return res.status(200).json({ messages });
  } catch (error) {
    console.error({ error });
    return res.status(500).send("Internal Server Error");
  }
};



export const uploadFile = async (req, res, next) => {
  try {
    if(!req.file){
       return res.status(400).send("File is required");
    }
    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let filename = `${fileDir}/${req.file.originalname}`;

    mkdirSync(fileDir,{ recursive: true});
    renameSync(req.file.path,filename);

    return res.status(200).json({ filepath: filename})
    
  } catch (error) {
    console.error({ error });
    return res.status(500).send("Internal Server Error");
  }
};
