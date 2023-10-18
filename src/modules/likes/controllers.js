const { default: mongoose } = require("mongoose");
const { Likes } = require("../../models/Likes"); // Adjust the path accordingly

async function addLike(req, res) {
  const { likerUserId, likedUserId } = req.body;
  try {
    // Check if a like already exists for the same pair of users
    const existingLike = await Likes.findOne({ likerUserId, likedUserId });

    if (existingLike) {
      res.status(400).json({
        status: false,
        message: "User has already liked this user.",
        data: null,
      });
    } else {
      // Create a new like if it doesn't exist
      const newLike = await Likes.create({ likerUserId, likedUserId });
      res.status(200).json({
        status: true,
        message: "User liked successfully.",
        data: newLike,
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

async function getMatches(req, res) {
  const { userId } = req.query;
  try {
    const matches = await Likes.aggregate([
      {
        $match: {
          $or: [
            { likerUserId: mongoose.Types.ObjectId(userId) },
            { likedUserId: mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { likedUserId: "$likedUserId", likerUserId: "$likerUserId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$likedUserId", "$$likerUserId"] },
                    { $eq: ["$likerUserId", "$$likedUserId"] },
                  ],
                },
              },
            },
          ],
          as: "match",
        },
      },
      {
        $unwind: "$match",
      },
      {
        $lookup: {
          from: "users",
          localField: "likerUserId",
          foreignField: "_id",
          as: "likerUser",
        },
      },
      {
        $unwind: "$likerUser",
      },
      {
        $lookup: {
          from: "users",
          localField: "likedUserId",
          foreignField: "_id",
          as: "likedUser",
        },
      },
      {
        $unwind: "$likedUser",
      },
      {
        $project: {
          likerUserId: 1,
          likedUserId: 1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $gte: ["$likerUserId", "$likedUserId"] },
              then: "$likerUserId",
              else: "$likedUserId",
            },
          },
          likerUserId: { $first: "$likerUserId" },
          likedUserId: { $first: "$likedUserId" },
        },
      },
      {
        $project: {
          _id: 0,
          likerUserId: 1,
          likedUserId: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "likerUserId",
          foreignField: "_id",
          as: "likerUserDetails",
        },
      },
      {
        $unwind: "$likerUserDetails",
      },
      {
        $lookup: {
          from: "users",
          localField: "likedUserId",
          foreignField: "_id",
          as: "likedUserDetails",
        },
      },
      {
        $unwind: "$likedUserDetails",
      },
      {
        $project: {
          likerUserId: 1,
          likedUserId: 1,
          likerUserDetails: 1, // Include likerUser details
          likedUserDetails: 1, // Include likedUser details
        },
      },
    ]);

    res.json(matches);
  } catch (error) {
    console.error("Error getting matches:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  getMatches,
  filterLikesByTime,
};
