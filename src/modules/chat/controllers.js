const { Chats } = require("../../models/Chats");

async function sendMessage(req, res) {
    try {
        const newChat = await Chats.create(req.body);
        const { receiverId } = req.body;
        const { senderId } = req.body;

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

async function getAllMessages(req, res) {
    try {
        const { id1, id2 } = req.body;

        // Use the $or operator with two conditions
        const allMessages = await Chats.find({
            $or: [
                {
                    receiverId: { $in: [id1, id2] },
                    senderId: { $in: [id1, id2] },
                },
            ],
        });

        console.log(allMessages);

        // Return allMessages directly, without trying to access .message
        res.json(allMessages);
    } catch (error) {
        console.log("THE ERROR ===", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while sending message.",
        });
    }
}

// async function deleteLike(req, res) {
//   const deleteid = req.params.deleteid; // Assuming you're passing deleteid as a URL parameter
//   try {
//     await Likes.findByIdAndDelete(deleteid);
//     res.status(200).json({
//       status: true,
//       message: "Like deleted successfully.",
//       data: null,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "An error occurred while deleting the like.",
//       data: null,
//     });
//   }
// }

// async function deleteAllLikes(req, res) {
//   try {
//     await Likes.deleteMany();
//     res.status(200).json({
//       status: true,
//       message: "Likes deleted successfully.",
//       data: null,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "An error occurred while deleting the like.",
//       data: null,
//     });
//   }
// }

// async function getUserLikes(req, res) {
//   const { userId, type } = req.body;
//   try {
//     let likedUsers;
//     if (type === "given") {
//       likedUsers = await Likes.find({ likerUserId: userId });
//     } else if (type === "received") {
//       likedUsers = await Likes.find({ likedUserId: userId });
//     } else {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid type specified.",
//         data: null,
//       });
//     }
//     res.status(200).json({
//       status: true,
//       message: "Liked users retrieved successfully.",
//       data: likedUsers,
//       likeCount: likedUsers?.length,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "An error occurred while retrieving liked users.",
//       data: null,
//     });
//   }
// }

// async function getLikes(req, res) {
//   try {
//     let likes = await Likes.find();
//     res.status(200).json({
//       status: true,
//       message: "Liked users retrieved successfully.",
//       data: likes,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "An error occurred while retrieving liked users.",
//       data: null,
//     });
//   }
// }

// async function getUserLikesData(req, res) {
//   const { userId, type } = req.body;
//   try {
//     let likedUsers;
//     if (type === "given") {
//       likedUsers = await Likes.find({ likerUserId: userId })
//         .populate("likerUserId")
//         .populate("likedUserId");
//     } else if (type === "received") {
//       likedUsers = await Likes.find({ likedUserId: userId })
//         .populate("likedUserId")
//         .populate("likerUserId");
//     } else {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid type specified.",
//         data: null,
//       });
//     }
//     res.status(200).json({
//       status: true,
//       message: "Liked users retrieved successfully.",
//       data: likedUsers,
//       likeCount: likedUsers?.length,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "An error occurred while retrieving liked users.",
//       data: null,
//     });
//   }
// }

module.exports = {
    sendMessage,
    getAllMessages,
    //   deleteLike,
    //   getUserLikes,
    //   getLikes,
    //   deleteAllLikes,
    //   getUserLikesData,
};
