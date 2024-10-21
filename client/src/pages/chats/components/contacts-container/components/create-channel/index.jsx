import { FaPlus } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES, HOST } from "@/utils/constants";
import { CONTACT_ROUTES } from "@/utils/constants";
import apiClient from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { userAppStore } from "@/store";
import { Button } from "@/components/ui/button";



import { useEffect, useState } from "react";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
  const {setSelectedChatType,setSelectedChatData,addChannel} = userAppStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  

  const [allContacts,setAllContacts] = useState([]);
  const [selectedContacts,setSelectedContacts] = useState([]);
  const [channelName,setChannelName] = useState("");



  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
          withCredentials: true,
        });
        
        // Normalize contacts to ensure each contact has a label
        //console.log(res.data.contacts)
        const contacts = res.data.contacts.map(contact => ({
          label: contact.label || `Contact ${contact.value}`, // Fallback label if none exists
          value: contact.value,
        }));
  
        setAllContacts(contacts);
       // console.log('Normalized contacts:', contacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    getData();
  }, []);
  

  const createChannel = async () => {
      try{
        if(channelName.trim() !== 0 && selectedContacts.length > 0){
          const res = await apiClient.post(CREATE_CHANNEL_ROUTE,{
            name:channelName,
            members: selectedContacts.map((contact)=> contact.value)
          },
            {withCredentials:true}
          )
          if(res.status === 201){
            setChannelName("");
            setSelectedContacts([]);
            setNewChannelModel(false);
            addChannel(res.data.channel);
          }
        } 

      }catch(error){
        console.error(error);
        
      }




  }


  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start translate-y-2 hover:text-neutral-100 
        cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle> Please fill up the details for new channel.</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] mb-5 border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />

          </div>
          {/* {console.log({allContacts})} */}
          <div>
            <MultipleSelector className="rounded-lg bg-[#2c2e3b]  overflow-scroll max-h-[20vh] scroll border-none py-2 text-white" 
            defaultOptions = {allContacts}
            placeholder="Search Contacts"
            value={selectedContacts}
            onChange={setSelectedContacts}
            emptyIndicator = {
                <p className="text-center text-lg text-gray-600 leading-5" >No results found.</p>
            }
            />
          </div>
          <div>
            <Button className="w-[90%] bg-purple-700 fixed bottom-5  hover:bg-purple-900 transition-all duration-300"
            onClick={createChannel}>
                Create Channel

            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

};

export default CreateChannel;
