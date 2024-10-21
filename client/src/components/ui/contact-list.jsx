import { useEffect } from "react";
import { userAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { getColor } from "@/utils/colors";
import { Avatar, AvatarImage } from "./avatar";
import { IoClose } from "react-icons/io5";
import { Button } from "./button";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedMessages,
  } = userAppStore();

  const handleClick = (contact) => {
    setSelectedChatType(isChannel ? "Channel" : "contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedMessages([]);
    }
  };

  useEffect(() => {
    
    console.log("Contacts or selected chat data changed.");
  }, [contacts, selectedChatData]);

  return (
    <div className="mt-5 bg-slate-800 rounded-lg">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`px-4 py-3 transition-all flex justify-between items-center rounded-sm duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-purple-500 text-black"
              : "hover:bg-purple-900 hover:text-black"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center space-x-4 text-white transition-all duration-300">
            {!isChannel ? (
              <Avatar className="h-10 w-10 relative rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}${contact.image}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 flex items-center rounded-full justify-center text-lg font-semibold uppercase ${getColor(
                      contact.color
                    )}`}
                  >
                    {contact.firstName
                      ? contact.firstName.charAt(0)
                      : contact.email && contact.email.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-gray-700 h-10 w-10 flex items-center justify-center rounded-full text-xl font-bold">
                #
              </div>
            )}
            <span className="font-medium">
              {isChannel
                ? contact.name
                : `${contact.firstName} ${contact.lastName}`}
            </span>
          </div>
          <Button className="bg-transparent hover:bg-transparent text-xl hover:text-black">
            <IoClose />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
