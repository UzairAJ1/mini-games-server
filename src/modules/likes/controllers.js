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
      likedUsers = await Likes.find({ likerUserId: userId }).populate("likerUserId").populate("likedUserId");
    } else if (type === "received") {
      likedUsers = await Likes.find({ likedUserId: userId }).populate("likedUserId").populate("likerUserId");
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
      likeCount: likedUsers?.length
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

    const likesStatistics = {
      totalLikes,
      maleLikes,
      femaleLikes,
      likesPerDay,
      likesPerMonth,
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




module.exports = {
  addLike,
  deleteLike,
  getUserLikes,
  getLikes,
  deleteAllLikes,
  getUserLikesData,
  likesStats
};
