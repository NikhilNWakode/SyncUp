import SyncUpLogo from "../logo";
import ProfileInfoComponent from "./profile-info";
import NewDm from "./new-dm";
import apiClient from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTE } from "@/utils/constants.js";
import { useEffect } from "react";
import { userAppStore } from "@/store";
import ContactList from "@/components/ui/contact-list";
import CreateChannel from "./components/create-channel";



const ContactContainer = () => {


  const {directMessagesContacts,setDirectMessagesContacts,channels,setChannels} = userAppStore();

  useEffect(()=>{
    const getContacts = async () => {
      console.log("get contact called")

      const res = await apiClient.get(GET_DM_CONTACTS_ROUTES,
        {withCredentials:true},
      );
     
      if (res.data.contacts){
        setDirectMessagesContacts(res.data.contacts);
      }
    };

    const getChannels = async ()=>{
      console.log("getchannels called");
      const res = await apiClient.get(GET_USER_CHANNELS_ROUTE,{withCredentials:true});
      console.log(res.data)
      if (res.data.channels){
        setChannels(res.data.channels);
      }
    }

    getContacts();
    getChannels();
  },[setChannels,setDirectMessagesContacts]);






  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full  ">
      <div className="pt-4 pl-2">
      <SyncUpLogo />
      </div>
      <div  className=" font-serif mt-5" >
        <div className="flex items-center  justify-between pl-4 pr-10" >
            <Title text="Direct Messages"  />
            <NewDm className=""/>
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden" >
            <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div  className=" font-serif mt-5" >
        <div className="flex items-center justify-between pl-4 pr-10" >
            <Title text="Channels"  />
            <CreateChannel/>
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden" >
            <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfoComponent />
    </div>
  );
};

 const Title = ({text}) =>{
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pt-5 font-light text-opacity-90 text-sm" >
            {text}
        </h6>
    )
}




export default ContactContainer;
