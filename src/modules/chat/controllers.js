const { Chats } = require("../../models/Chats");
const { v4: uuidv4 } = require('uuid');

  


  function generateRoomID(senderId, receiverId) {
    return `${senderId}-${receiverId}`;
  }


async function sendMessage(req, res) {
    try {
       
        const { receiverId,senderId,message } = req.body;

      
        const newChat = await Chats.create({receiverId,senderId,message});
   
       
        res.status(200).json({
            success: true,
            message: "Message successfully sent",
            data: newChat,
        });
    } catch (error) {
        console.log("THE ERROR ===", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while sending message.",
        });
    }
}



module.exports = {
    sendMessage,
    
  
    //   deleteLike,
    //   getUserLikes,
    //   getLikes,
    //   deleteAllLikes,
    //   getUserLikesData,
};
