import { userAppStore } from "@/store";
import { HOST, AUTH_ROUTES, LOGOUT_ROUTE } from "@/utils/constants";
import { getColor } from "@/utils/colors";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AiOutlineLogout } from "react-icons/ai";
import apiClient from "@/lib/api-client";

const ProfileInfoComponent = () => {
  const { userInfo, setUserInfo } = userAppStore();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0  bg-[#2a2b33] py-2 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 relative rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}${AUTH_ROUTES}/${userInfo.image}`}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full rounded-full flex items-center justify-center text-lg uppercase ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.email && userInfo.email.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
          <div>
            {userInfo.firstName && userInfo.lastName && (
              <h1 className="font-serif">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <FaEdit
                  className="text-xl cursor-pointer"
                  onClick={() => navigate("/profile")}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                Edit Profile
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AiOutlineLogout
                  className="text-xl cursor-pointer"
                  onClick={logOut}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                Log out
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoComponent;