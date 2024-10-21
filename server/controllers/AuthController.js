import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken'; // Import directly without destructuring
import { config } from 'dotenv';
import bcrypt from "bcrypt";
import {renameSync,unlinkSync} from "fs";


config(); // Ensure dotenv config is called

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: maxAge,
    });
};

const signup = async (req, res) => {
  try {
      const { username, email, password } = req.body;
      
      console.log('Signup attempt:', { username, email }); // Debug log
      
      // Check if email and password are provided
      if (!email || !password) {
          console.log('Signup failed: Email or password missing');
          return res.status(400).json({ message: "Email and password are required" });
      }

      // Check if the user with the provided email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          console.log('Signup failed: User already exists');
          return res.status(409).json({ message: "User already exists" });
      }

      // Create a new user
      const user = await User.create({ username, email, password });
      //console.log('New user created:', user._id);

      // Create a JWT token
      const token = createToken(email, user._id);
      //console.log('JWT token created');

      // Set the token as a cookie
      res.cookie('jwt', token, {
          maxAge: maxAge * 1000, // Convert seconds to milliseconds
          httpOnly: true, // Protect against XSS attacks
          secure: process.env.NODE_ENV === 'production', // Set to true in production
          sameSite:  process.env.NODE_ENV === 'production'?'None' : "Lax", // Required for cross-site cookies
      });
      console.log('JWT cookie set:', token);

      return res.status(201).json({
          user: {
              id: user._id,
              email: user.email,
              profileSetup: user.profileSetup,
          },
      });
  } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

 const login = async (req, res) => {
   
    try {
        const { email, password } = req.body;
        console.log("Received login request:", { email, password }); // Log request payload

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            console.log("Invalid password");
            console.error("Invalid password:", res);
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = createToken(email, user._id);
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        });

       // console.log("Login successful, sending token:", token);
       return res.status(200).json({
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileSetup: user.profileSetup,
            image: user.image || null, // Include image in response
        },
    });
    } catch (error) {
        console.error("Login error:", error); 
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
 const getUserInfo = async (req ,res, next) => {
    try {
     
  
      const userData = await User.findById(req.userId).select('-password');
  
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const userResponse = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileSetup: userData.profileSetup,
        image: userData.image,
        color: userData.color,
      };
  
      return res.status(200).json(userResponse);
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };

const updateProfile = async (req,res,next)=>{
    try{
        const {userId} = req;
        const {firstName, lastName,  color,email} = req.body;
        if(!firstName || !lastName ){
            return res.status(404).send("FirstName ,lastName and color is required.");
        }
        
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                color,
                email,
                profileSetup:true,
               
            },
            {new:true,runValidators:true}
        );

        return res.status(200).json({
            id:userData.id,
            email:userData.email,
            firstName:userData.firstName,
            lastName:userData.lastName,
            profileSetup:userData.profileSetup,
            image:userData.image,
            color:userData.color,

        });

    }catch(error){
        console.log({error});
        return res.status(500).json({message:"Internal Server Error",error:error.message});
    }
  }
  const addProfileImage = async (req, res, next) => {
    try {
      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).send("Please upload a profile image");
      }
  
      // Create a unique file name
      const date = Date.now();
      const fileName = `uploads/profiles/${date}_${req.file.originalname}`;
  
      // Rename the uploaded file to the new file path
      renameSync(req.file.path, fileName);
  
      // Update the user document with the new image path
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { image: fileName },
        { new: true, runValidators: true }
      );
  
      // Check if the user was found and updated
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
  
      // Respond with the updated user data
      return res.status(200).json({
        image: updatedUser.image,
       
      });
      
    } catch (error) {
      console.error("Error updating profile image:", error);
      return res.status(500).send("Internal server error");
    }
  };
  
   
  
const removeProfileImage = async (req,res,next)=>{
    try{
        const {userId} = req;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(user.image){
            unlinkSync(user.image)
        }
        user.image = null;
        await user.save();
        return res.status(200).json({message:"Profile image removed"});

    }catch(error){
        console.log({error});
        return res.status(500).json({message:"Internal Server Error",error:error.message});
    }
  }
  const logOut = async (req, res, next) => {
    try {
        // Clear the JWT cookie
        res.cookie("jwt", "", {
            maxAge: 1,
            httpOnly: true,  // Recommended for security
            secure: true,    // Only send cookie over HTTPS
            sameSite: "None" // Allows cross-site cookies
        });

        // Send success response
        return res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.error("Logout error:", error); // Better error logging
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export { signup, login,logOut, getUserInfo,updateProfile,addProfileImage,removeProfileImage };