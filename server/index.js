import express from "express";
import dotenv, { configDotenv } from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import { getUserInfo } from "./controllers/AuthController.js";
import { verifyToken } from "./middlewares/AuthMiddleware.js";
import contactRoutes from "./routes/ContactRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";
import setupSocket from "./socket.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;






app.use(
  cors({
    origin: [process.env.origin],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api/auth/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use("/api/messages/uploads/files",express.static("uploads/files"))
app.use("/uploads/files",express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts",contactRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/channel",channelRoutes);


const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    // Validate request data
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    } // If successful, send a success response
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" }); // Or a more specific error message
  }
});
app.post(`/api/auth/login`, async (req, res) => {
  try {
    // Validate request data
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    } // If successful, send a success response
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" }); // Or a more specific error message
  }
});
app.get("/user-info", verifyToken, getUserInfo);

setupSocket(server)


mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    err.message;
  });
