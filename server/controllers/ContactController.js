import User from '../models/UserModel.js';
import Messages from '../models/MessagesModel.js';
import mongoose from 'mongoose';

export const searchContacts = async (req,res,next)=>{
    try{
        const {searchTerm} = req.body;
        if(searchTerm === undefined || searchTerm === null){
            return res.status(400).json({message: 'Search term is required'});
        }
        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g,
    "\\$&")
        const regex = new RegExp(sanitizedSearchTerm,"i");
        const contacts = await User.find({
            $and: [
                {_id:{$ne: req.userId}},
                {$or:[{firstName:regex},{lastName:regex},{email:regex},]},
            ],
        },
           ).select('firstName lastName email image color');;
        
        
        return res.status(200).json({contacts});

    }catch(error){
        console.log({error});
        return res.status(500).json({message:"Internal Server Error",error:error.message});
    }
  }

  export const getContactsForDMList = async (req, res, next) => {
    try {
      let { userId } = req;
  
      // Check if userId is valid and convert it
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error('Invalid userId format:', userId);
        return res.status(400).json({ message: 'Invalid userId format' });
      }
  
      userId = new mongoose.Types.ObjectId(userId);
  
     // console.log('Finding messages for userId:', userId);
  
      const messages = await Messages.find({
        $or: [
          { sender: userId },
          { recipent: userId }
        ]
      });
  
     // console.log('Messages found for userId:', messages);
  
      if (!messages.length) {
        console.log('No messages found for userId:', userId);
        return res.status(200).json({ contacts: [] });
      }
  
     // console.log('Running aggregation pipeline...');
      const contacts = await Messages.aggregate([
        {
          $match: {
            $or: [
              { sender: userId },
              { recipent: userId }
            ]
          }
        },
        {
          $sort: { timestamp: -1 }
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$sender", userId] },
                then: "$recipent",
                else: "$sender"
              }
            },
            lastMessageTime: { $first: "$timestamp" }
          }
        }
      ]);
  
     // console.log('Contacts after aggregation:', contacts);
  
      if (!contacts.length) {
        console.log('No contacts found after aggregation for userId:', userId);
        return res.status(200).json({ contacts: [] });
      }
  
      // Extracting IDs for lookup
      const contactIds = contacts.map(contact => contact._id);
      console.log('Running $lookup for contact details with IDs:', contactIds);
  
      // Check if the contact IDs exist in the users collection
      const existingUsers = await User.find({ _id: { $in: contactIds } });
      console.log('Existing users for lookup:', existingUsers);
  
      const detailedContacts = await User.aggregate([
        {
          $match: {
            _id: { $in: contactIds }
          }
        },
        {
          $lookup: {
            from: 'messages',  // Assuming you need to get message info if required
            localField: '_id',
            foreignField: 'sender', // or 'recipent' based on your requirements
            as: 'messages' // Adjust this as necessary
          }
        },
        {
          $project: {
            _id: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            image: 1,
            color: 1
          }
        }
      ]);
  
      //console.log('Detailed contacts after lookup:', detailedContacts);
  
      return res.status(200).json({ contacts: detailedContacts });
    } catch (error) {
      console.error('Error occurred while getting contacts for DM list:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };


  export const getALlContacts = async (req,res,next)=>{
    try{
      const users = await User.find(
        {_id: { $ne: req.userId}},
        "firstName lastName _id email"
      );
      
      const contacts = users.map((user)=>({
        label:user.email ? (user.email) :(`${user.firstName}  ${user.lastName}`) ,
        value: user._id,

      }));

      return res.status(200).send({contacts});



    }catch(error){
        console.log({error});
        return res.status(500).json({message:"Internal Server Error",error:error.message});
    }
  }
