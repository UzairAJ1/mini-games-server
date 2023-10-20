const { default: mongoose } = require("mongoose");
const { Likes } = require("../../models/Likes"); // Adjust the path accordingly
const { Matches } = require("../../models/Matches");
const { GlobalSettings } = require("../../models/GlobalSettings");
const { User } = require("../../models/User");

// async function addLike(req, res) {
//   const { likerUserId, likedUserId } = req.body;
//   try {

//     // Check if a like already exists for the same pair of users
//     const existingLike = await Likes.findOne({ likerUserId, likedUserId });

//     if (existingLike) {
//       res.status(400).json({
//         status: false,
//         message: "User has already liked this user.",
//         data: null,
//       });
//     } else {
//       const globalSettings = await GlobalSettings.findOne()
//       const { likeLimit, likeTimerLimit } = globalSettings
//       // Create a new like if it doesn't exist
//       const newLike = await Likes.create({ likerUserId, likedUserId });

//       const user = await User.findById(likerUserId);

//       if (user.remainingLikes > 1) {
//         // If remainingLikes is more than 1, decrement it by 1
//         user.remainingLikes -= 1;
//       } else if (user.remainingLikes == 1) {
//         // If remainingLikes is 1, decrement it by 1 and update likesTimeoutDate
//         user.remainingLikes -= 1;
//         user.likesTimeoutDate = new Date(Date.now() + likeTimerLimit * 60000);
//       }

//       const updatedUser = await user.save();

//       // Check if the reverse like exists (likedUserId liking likerUserId)
//       const reverseLike = await Likes.findOne({ likerUserId: likedUserId, likedUserId: likerUserId });

//       if (reverseLike) {
//         // If reverse like exists, create a match
//         await Matches.create({ matchedUsers: [likerUserId, likedUserId] });
//         res.status(200).json({
//           status: true,
//           message: "User liked successfully and a match is created.",
//           data: newLike,
//         });
//       } else {
//         res.status(200).json({
//           status: true,
//           message: "User liked successfully. No match created yet.",
//           data: newLike,
//         });
//       }
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "An error occurred while liking the user.",
//       data: null,
//     });
//   }
// }

async function addLike(req, res) {
  const { likerUserId, likedUserId } = req.body;
  try {
    const user = await User.findById(likerUserId);
    const globalSettings = await GlobalSettings.findOne();
    const { likeLimit, likeTimerLimit } = globalSettings;

    if (user.remainingLikes === 0) {
      // If remainingLikes is 0, check if likesTimeoutDate has passed
      if (user.likesTimeoutDate && user.likesTimeoutDate > new Date()) {
        // If likesTimeoutDate has not passed, show a message and return
        return res.status(400).json({
          status: false,
          message: "Please wait until the timeout is finished.",
          data: null,
          remainingLikes: user.remainingLikes,
          likesTimeoutDate: user.likesTimeoutDate
        });
      } else {
        // If likesTimeoutDate has passed, reset remainingLikes and likesTimeoutDate
        user.remainingLikes = likeLimit;
        user.likesTimeoutDate = null;
      }
    }

    // Check if a like already exists for the same pair of users
    const existingLike = await Likes.findOne({ likerUserId, likedUserId });

    if (existingLike) {
      return res.status(400).json({
        status: false,
        message: "User has already liked this user.",
        data: null,
      });
    }

    // Create a new like if it doesn't exist
    const newLike = await Likes.create({ likerUserId, likedUserId });

    if (user.remainingLikes > 1) {
      // If remainingLikes is more than 1, decrement it by 1
      user.remainingLikes -= 1;
    } else if (user.remainingLikes === 1) {
      // If remainingLikes is 1, decrement it by 1 and update likesTimeoutDate
      user.remainingLikes -= 1;
      user.likesTimeoutDate = new Date(Date.now() + likeTimerLimit * 60000);
    }

    const updatedUser = await user.save();

    // Check if the reverse like exists (likedUserId liking likerUserId)
    const reverseLike = await Likes.findOne({ likerUserId: likedUserId, likedUserId: likerUserId });

    if (reverseLike) {
      // If reverse like exists, create a match
      await Matches.create({ matchedUsers: [likerUserId, likedUserId] });
      res.status(200).json({
        status: true,
        message: "User liked successfully and a match is created.",
        data: newLike,
        remainingLikes: updatedUser.remainingLikes,
        likesTimeoutDate: updatedUser.likesTimeoutDate
      });
    } else {
      res.status(200).json({
        status: true,
        message: "User liked successfully. No match created yet.",
        data: newLike,
        remainingLikes: updatedUser.remainingLikes,
        likesTimeoutDate: updatedUser.likesTimeoutDate
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while liking the user.",
      data: null,
    });
  }
}

async function deleteLike(req, res) {
  const deleteid = req.params.deleteid; // Assuming you're passing deleteid as a URL parameter
  try {
    await Likes.findByIdAndDelete(deleteid);
    res.status(200).json({
      status: true,
      message: "Like deleted successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the like.",
      data: null,
    });
  }
}

async function deleteAllLikes(req, res) {
  try {
    await Likes.deleteMany();
    res.status(200).json({
      status: true,
      message: "Likes deleted successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the like.",
      data: null,
    });
  }
}

async function getUserLikes(req, res) {
  const { userId, type } = req.body;
  try {
    let likedUsers;
    if (type === "given") {
      likedUsers = await Likes.find({ likerUserId: userId });
    } else if (type === "received") {
      likedUsers = await Likes.find({ likedUserId: userId });
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid type specified.",
        data: null,
      });
    }
    res.status(200).json({
      status: true,
      message: "Liked users retrieved successfully.",
      data: likedUsers,
      likeCount: likedUsers?.length,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving liked users.",
      data: null,
    });
  }
}

async function getLikes(req, res) {
  try {
    let likes = await Likes.find();
    res.status(200).json({
      status: true,
      message: "Liked users retrieved successfully.",
      data: likes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving liked users.",
      data: null,
    });
  }
}

async function getUserLikesData(req, res) {
  const { userId, type } = req.body;
  try {
    let likedUsers;
    if (type === "given") {
      likedUsers = await Likes.find({ likerUserId: userId })
        .populate("likerUserId")
        .populate("likedUserId");
    } else if (type === "received") {
      likedUsers = await Likes.find({ likedUserId: userId })
        .populate("likedUserId")
        .populate("likerUserId");
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid type specified.",
        data: null,
      });
    }
    res.status(200).json({
      status: true,
      message: "Liked users retrieved successfully.",
      data: likedUsers,
      likeCount: likedUsers?.length,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving liked users.",
      data: null,
    });
  }
}



const likesStats = async (req, res) => {
  try {
    const totalLikes = await Likes.countDocuments();

    //Likes by male
    const maleLikes = await Likes.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "likerUserId",
          foreignField: "_id",
          as: "likerUser",
        },
      },
      {
        $match: {
          "likerUser.gender": "male",
        },
      },
      {
        $count: "maleLikes",
      },
    ]);

    //Likes by female
    const femaleLikes = await Likes.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "likerUserId",
          foreignField: "_id",
          as: "likerUser",
        },
      },
      {
        $match: {
          "likerUser.gender": "female",
        },
      },
      {
        $count: "femaleLikes",
      },
    ]);

    //Likes per day
    const likesPerDay = await Likes.aggregate([
      {
        $addFields: {
          formattedDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$createdAt" },
              timezone: "UTC",
            },
          },
        },
      },
      {
        $group: {
          _id: "$formattedDate",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    //Likes per month
    const likesPerMonth = await Likes.aggregate([
      {
        $addFields: {
          formattedDate: {
            $dateToString: {
              format: "%Y-%m",
              date: { $toDate: "$createdAt" },
              timezone: "UTC",
            },
          },
        },
      },
      {
        $group: {
          _id: "$formattedDate",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const likesPerDayMale = await Likes.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "likerUserId",
          foreignField: "_id",
          as: "likerUser",
        },
      },
      {
        $match: {
          "likerUser.gender": "male",
        },
      },
      {
        $addFields: {
          formattedDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$createdAt" },
              timezone: "UTC",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            formattedDate: "$formattedDate",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.formattedDate": 1 },
      },
    ]);

    // Likes per month for male users
    const likesPerMonthMale = await Likes.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "likerUserId",
          foreignField: "_id",
          as: "likerUser",
        },
      },
      {
        $match: {
          "likerUser.gender": "male",
        },
      },
      {
        $addFields: {
          formattedDate: {
            $dateToString: {
              format: "%Y-%m",
              date: { $toDate: "$createdAt" },
              timezone: "UTC",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            formattedDate: "$formattedDate",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.formattedDate": 1 },
      },
    ]);

    // Likes per day for female users
    const likesPerDayFemale = await Likes.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "likerUserId",
          foreignField: "_id",
          as: "likerUser",
        },
      },
      {
        $match: {
          "likerUser.gender": "female",
        },
      },
      {
        $addFields: {
          formattedDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$createdAt" },
              timezone: "UTC",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            formattedDate: "$formattedDate",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.formattedDate": 1 },
      },
    ]);

    // Likes per month for female users
    const likesPerMonthFemale = await Likes.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "likerUserId",
          foreignField: "_id",
          as: "likerUser",
        },
      },
      {
        $match: {
          "likerUser.gender": "female",
        },
      },
      {
        $addFields: {
          formattedDate: {
            $dateToString: {
              format: "%Y-%m",
              date: { $toDate: "$createdAt" },
              timezone: "UTC",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            formattedDate: "$formattedDate",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.formattedDate": 1 },
      },
    ]);

    const likesStatistics = {
      totalLikes,
      maleLikes,
      femaleLikes,
      likesPerDay,
      likesPerMonth,
      likesPerDayMale,
      likesPerMonthMale,
      likesPerDayFemale,
      likesPerMonthFemale,
    };

    res.status(200).json({
      data: likesStatistics,
      status: true,
      message: "Likes Statistics",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving likes statistics.",
      data: null,
    });
  }
};
async function filterLikesByTime(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - today.getDay());

    const thisMonth = new Date(today);
    thisMonth.setDate(1);

    const thisYear = new Date(today);
    thisYear.setMonth(0, 1);

    const likesDaily = await Likes.find({
      createdAt: {
        $gte: today,
      },
    });

    const likesWeekly = await Likes.find({
      createdAt: {
        $gte: thisWeek,
      },
    })
      .populate("likerUserId")
      .populate("likedUserId");

    const likesMonthly = await Likes.find({
      createdAt: {
        $gte: thisMonth,
      },
    })
      .populate("likerUserId")
      .populate("likedUserId");

    const likesYearly = await Likes.find({
      createdAt: {
        $gte: thisYear,
      },
    })
      .populate("likerUserId")
      .populate("likedUserId");

    const likesTotal = await Likes.find()
      .populate("likerUserId")
      .populate("likedUserId");

    res.status(200).json({
      likesDaily,
      likesWeekly,
      likesMonthly,
      likesYearly,
      likesTotal,
    });
  } catch (error) {
    console.log("ERROR =====", error);
    res.status(500).json({ error: "Failed to get users" });
  }
}

module.exports = {
  addLike,
  deleteLike,
  getUserLikes,
  getLikes,
  deleteAllLikes,
  getUserLikesData,
  likesStats,
  filterLikesByTime,
};
