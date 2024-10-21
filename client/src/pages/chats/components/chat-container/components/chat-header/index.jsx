import { RiCloseFill } from "react-icons/ri";
import { userAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/utils/colors";
import { HOST } from "@/utils/constants";
import { IoMdCall } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";



const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType,users } = userAppStore();

  

  return (
    <div className="border-b-2 border-[#2f303b] flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-5 cursor-pointer">
        {
          selectedChatType === "contact" ? ( <Avatar className="h-12 w-12 relative rounded-full overflow-hidden">
            {selectedChatData.image ? (
              <AvatarImage
                src={`${HOST}${selectedChatData.image}`}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center rounded-full justify-center text-lg uppercase ${getColor(
                  selectedChatData.color
                )}`}
              >
                {selectedChatData.firstName
                  ? selectedChatData.firstName.charAt(0)
                  : selectedChatData.email &&
                    selectedChatData.email.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>):(
              <div className="bg-gray-700 h-10 w-10 flex items-center justify-center rounded-full text-xl font-bold">
                #
              </div>
            )
        }
       
        <div className="flex flex-col">
          <span>
            {selectedChatType === "Channel" && selectedChatData.name ? (selectedChatData.name):("")}
            {selectedChatType === "contact" && selectedChatData.firstName ? (
              <h1 className="font-semibold">{`${selectedChatData.firstName} ${selectedChatData.lastName}`}</h1>
            ) : (
              <h1 className="font-semibold">{selectedChatData.email}</h1>
            )}
          </span>
        </div>
      
       
      </div>
      <div className="flex items-center justify-center gap-5">
        
          <button className="text-neutral-500 hover:text-white focus:outline-none transition-colors duration-300">
              <IoMdCall className="text-2xl hidden"/>
          </button>
          <button className="text-neutral-500 hover:text-white focus:outline-none transition-colors duration-300">
              <IoVideocam className="text-2xl hidden" />
          </button>
        
       
      <button
        className="text-neutral-500 hover:text-white focus:outline-none transition-colors duration-300"
        onClick={() => {
          closeChat(); // Call your previous function
          window.location.reload(); // Refresh the page
        }}
      >
        <RiCloseFill className="text-3xl" />
      </button>
      </div>
    </div>
  );
 
};

export default ChatHeader;
