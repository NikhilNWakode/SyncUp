import React, { useState, useEffect, useRef } from "react";
import { userAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getColor, colors } from "@/utils/colors";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  UPDATE_PROFILE_ROUTE,
  ADD_PROFILE_IMAGE_ROUTE,
  REMOVE_PROFILE_IMAGE_ROUTE,
} from "@/utils/constants";
import apiClient from "@/lib/api-client";
import { AUTH_ROUTES } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = userAppStore();
  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [image, setImage] = useState(userInfo.image || null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo.color || 0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setSelectedColor(userInfo.color || 0);
    }
    if (userInfo.image) {
      setImage(
        `https://syncup-backend.onrender.com/${AUTH_ROUTES}/${userInfo.image}` ||
          (userInfo.email && userInfo.email.charAt(0).toUpperCase())
      );
      console.log(`https://syncup-backend.onrender.com/${AUTH_ROUTES}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName.trim()) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          
          withCredentials: true,
        });
        if (res.status === 200 && res.data.image) {
          setUserInfo({ ...userInfo, image: res.data.image });
          setImage(res.data.image);
          toast.success("Image updated successfully.");

          const reader = new FileReader();
          reader.onload = () => {
            setImage(reader.result);
          };
          reader.readAsDataURL(file); // Read the file
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image. Please try again.");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image remove successfully.");
        setImage(null);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor, },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data) {
          setUserInfo(res.data);
          toast.success("Profile updated successfully!");
          navigate("/chat");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    
      
    <div className="min-h-screen w-full bg-gradient-to-b from-[#17153B] to-black flex flex-col items-center justify-center p-4 md:p-8">
      <h1 className='text-4xl font-semibold text-gray-300 font-serif md:text-5xl'>Profile</h1>
      <div className="w-full max-w-4xl bg-[#2E236C]/50 rounded-3xl shadow-lg overflow-hidden border border-blue-200">
        <div className="p-6 md:p-10"
        >
          <IoArrowBack
            className="text-3xl md:text-4xl text-gray-400 cursor-pointer mb-6 hover:text-gray-500 transition-colors"
            onClick={() => navigate("/chat") }
            
          />
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <div
                className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden cursor-pointer shadow-md"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <Avatar className="w-full h-full">
                  {image ? (
                    <AvatarImage
                      src={image}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                    className={`w-full h-full rounded-full flex items-center justify-center text-4xl md:text-5xl uppercase ${colors[selectedColor]}`}
                    style={{ backgroundColor: selectedColor >= 0 ? colors[selectedColor].split(' ')[0] : 'transparent' }}                    >
                      {firstName
                        ? firstName.charAt(0)
                        : userInfo.email &&
                          userInfo.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Avatar>
                {hovered && (
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 transition-opacity duration-300"
                    onClick={image ? handleDeleteImage : handleFileInputClick}
                  >
                    {image ? (
                      <FaTrash className="text-white text-2xl md:text-3xl hover:text-red-400 transition-colors" />
                    ) : (
                      <FaPlus className="text-white text-2xl md:text-3xl hover:text-green-400 transition-colors" />
                    )}
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
                name="profile-image"
                accept=".jpg, .png, .jpeg, .svg, .webp"
              />
            </div>
            <div className="flex-1 space-y-4">
              <Input
                type="email"
                placeholder="Email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-4 bg-gray-200 text-gray-700 border-none"
              />
              <Input
                type="text"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-4 bg-white text-gray-800 border border-blue-200 focus:border-blue-400 transition-colors"
              />
              <Input
                type="text"
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-4 bg-white text-gray-800 border border-blue-200 focus:border-blue-400 transition-colors"
              />
              <div className="flex flex-wrap gap-3">
                {colors.map((color, index) => (
                  <div
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                      selectedColor === index
                        ? "ring-2 ring-offset-blue-200 ring-blue-200"
                        : ""
                    }`}
                    key={index}
                    onClick={() => setSelectedColor(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Button
              className="w-[80%] h-12 rounded-xl text-lg bg-blue-700 hover:bg-blue-800 transition-all duration-300 text-white shadow-md"
              onClick={saveChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
