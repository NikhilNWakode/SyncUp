export const createChatSLice = (set,get) => ({
    selectedChatType:undefined,
    selectedChatData:undefined,
    selectedChatMessages:[],
    directMessagesContacts:[],
    isUploading:false,
    isDownloading:false,
    fileDownloadProgress:0,
    fileUploadProgress:0,
    channels:[],
    notifications: [],
    users: {},

    
    setUserStatus: (userId, isOnline) =>
      set((state) => ({
        users: {
          ...state.users,
          [userId]: { ...state.users[userId], isOnline },
        },
      })),




    setChannels:(channels)=>set({channels}),
    setIsUploading:(isUploading)=> set({isUploading}),
    setIsDownloading:(isDownloading)=>set({isDownloading}),
    setFileDownloadProgress:(fileDownloadProgress)=> set({fileDownloadProgress}),
    setFileUploadProgress:(fileUploadProgress)=> set({fileUploadProgress}),


    setSelectedChatType:(selectedChatType) => set({selectedChatType}),
    setSelectedChatData:(selectedChatData) => set({selectedChatData}),
    setSelectedChatMessages:(selectedChatMessages) => set({selectedChatMessages}),
    
    setDirectMessagesContacts:(directMessagesContacts) => set({directMessagesContacts}),
    setSelectedChatMessages: (selectedChatMessages)=>
    set({selectedChatMessages}),
   
    addChannel: (channel) => {
        const channels =get().channels;
        set({ channels: [channel,...channels]});
    },

    addNotification: (message) =>
        set((state) => ({
          notifications: [...state.notifications, message],
        })),
        clearNotifications: () => set({ notifications: [] }),
   
   
    closeChat: () => set(
        {selectedChatData:undefined,
            selectedChatType:undefined,
            selectedChatMessages:[]
        }),
        addMessage:(message)=>{
            const selectedChatMessages = get().selectedChatMessages;
            const selectedChatType = get().selectedChatType;


            set({
                selectedChatMessages: [
                    ...selectedChatMessages,
                    {
                        ...message,
                        recipent:
                        selectedChatType === "Channel"
                        ? message.recipent: message.recipent._id,
                        sender:
                        selectedChatType === "Channel"
                        ? message.sender: message.sender._id,
                    }
                    
                ]
            })

        }
});