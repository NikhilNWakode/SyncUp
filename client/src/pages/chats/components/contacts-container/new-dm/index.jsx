import { FaPlus } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import { getColor } from "@/utils/colors";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { HOST } from "@/utils/constants";
import { CONTACT_ROUTES } from "@/utils/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Lottie from "react-lottie";
import apiClient from "@/lib/api-client";
import { animationDefaultOptions } from "@/utils/animation";
import { Input } from "@/components/ui/input";
import { SEARCH_CONTACT_ROUTES } from "@/utils/constants";
import { userAppStore } from "@/store";



import { useState } from "react";

const NewDm = () => {
  const {setSelectedChatType,setSelectedChatData} = userAppStore();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  


  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACT_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.contacts) {
          console.log(res.data.contacts)
          setSearchedContacts(res.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectNewContact = (contact) =>{
      setOpenNewContactModel(false);
      setSelectedChatType('contact');
      setSelectedChatData(contact);
      setSearchedContacts([]);
  }


  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start translate-y-2 hover:text-neutral-100 
        cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Select New Contact </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle> Please Select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] mb-5 border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />

          {searchContacts.length > 0 && (
              <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  
                  <div
                    key={contact._id}
                    className="flex  gap-5 items-center cursor-pointer "
                    onClick={()=>selectNewContact(contact)}
                  >
                    {console.log(`http://localhost:8747/${contact.image}`)}
                    <Avatar className="h-12 w-12 relative mr-6 rounded-full overflow-hidden">
                      {contact.image ? (
                        <AvatarImage
                          src={`http://localhost:8747/${contact.image}`}
                          alt="profile"
                          className="w-12 h-12 rounded-full bg-black object-cover"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg  uppercase ${getColor(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.charAt(0)
                            : contact.email &&
                              contact.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName ? 
                        <h1>{`${contact.firstName}  ${contact.lastName}`}</h1>
                        : ""}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          </div>
          {searchedContacts.length <= 0 && (
            <div>
              <div className="flex-1  translate-y-[-270px] bg-[#1b1c25] rounded-lg md:flex flex-col justify-center items-center   duration-1000 transition-all ">
                <Lottie
                  isClickToPauseDisabled={true}
                  height={200}
                  width={180}
                  options={animationDefaultOptions}
                />
                <div
                  className="text-opacity-80 text-white flex flex-col gap-5 item-center  translate-y-[-6px] 
       text-2xl transition-all duration-300 text-center"
                >
                  <h3 className="poppins-medium  font-serif">
                    Hi <span className="text-purple-500 ">!</span> Search new{" "}
                    <br />
                    <span className="text-purple-500 font-semibold">
                      Contact
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );

};

export default NewDm;
