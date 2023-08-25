const { Likes } = require("../../models/Likes"); // Adjust the path accordingly

async function addLike(req, res) {
  const { likerUserId, likedUserId } = req.body;
  try {
    const newLike = await Likes.create({ likerUserId, likedUserId });
    res.status(200).json({
      status: true,
      message: 'User liked successfully.',
      data: newLike
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'An error occurred while liking the user.',
      data: null
    });
  }
}

async function deleteLike(req, res) {
  const deleteid = req.params.deleteid; // Assuming you're passing deleteid as a URL parameter
  try {
    await Likes.findByIdAndDelete(deleteid);
    res.status(200).json({
      status: true,
      message: 'Like deleted successfully.',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'An error occurred while deleting the like.',
      data: null
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
        message: 'Invalid type specified.',
        data: null
      });
    }
    res.status(200).json({
      status: true,
      message: 'Liked users retrieved successfully.',
      data: likedUsers
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving liked users.',
      data: null
    });
  }
}

async function getLikes(req, res) {
  try {
    let likes = await Likes.find(); // You forgot to await here
    res.status(200).json({
      status: true,
      message: 'Liked users retrieved successfully.',
      data: likes
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving liked users.',
      data: null
    });
  }
}

module.exports = {
  addLike,
  deleteLike,
  getUserLikes,
  getLikes
};