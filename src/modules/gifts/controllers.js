const { Gifts } = require("../../models/Gifts"); // Adjust the path accordingly
const { User } = require("../../models/User");

async function sendGift(req, res) {
  const { gifterUserId, recipientUserId, gift } = req.body;
  try {
    const newGift = await Gifts.create({ gifterUserId, recipientUserId, gift });
    const giftId = gift._id;

    await User.findOneAndUpdate(
      { _id: gifterUserId },
      { $pull: { myGiftsCollection: { _id: giftId } } }
    );

    res.status(200).json({
      status: true,
      message: "Gift sent successfully.",
      data: newGift,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while sending the gift.",
      data: null,
    });
  }
}


async function deleteGift(req, res) {
  const deleteid = req.params.deleteid; // Assuming you're passing deleteid as a URL parameter
  try {
    await Gifts.findByIdAndDelete(deleteid);
    res.status(200).json({
      status: true,
      message: "Gift deleted successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the gift.",
      data: null,
    });
  }
}

async function deleteAllGifts(req, res) {
  try {
    await Gifts.deleteMany();
    res.status(200).json({
      status: true,
      message: "Gifts deleted successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the gifts.",
      data: null,
    });
  }
}

async function getUserGifts(req, res) {
  const { userId, type } = req.body;
  try {
    let sentGifts;
    if (type === "sent") {
      sentGifts = await Gifts.find({ gifterUserId: userId });
    } else if (type === "received") {
      sentGifts = await Gifts.find({ recipientUserId: userId });
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid type specified.",
        data: null,
      });
    }
    res.status(200).json({
      status: true,
      message: "Gifts retrieved successfully.",
      data: sentGifts,
      giftCount: sentGifts?.length
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving gifts.",
      data: null,
    });
  }
}

async function getGifts(req, res) {
  try {
    let gifts = await Gifts.find();
    res.status(200).json({
      status: true,
      message: "Gifts retrieved successfully.",
      data: gifts,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving gifts.",
      data: null,
    });
  }
}

async function getUserGiftsData(req, res) {
  const { userId, type } = req.body;
  try {
    let sentGifts;
    if (type === "sent") {
      sentGifts = await Gifts.find({ gifterUserId: userId }).populate("gifterUserId").populate("recipientUserId");
    } else if (type === "received") {
      sentGifts = await Gifts.find({ recipientUserId: userId }).populate("recipientUserId").populate("gifterUserId");
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid type specified.",
        data: null,
      });
    }
    res.status(200).json({
      status: true,
      message: "Gifts retrieved successfully.",
      data: sentGifts,
      giftCount: sentGifts?.length
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving gifts.",
      data: null,
    });
  }
}

module.exports = {
  sendGift,
  deleteGift,
  getUserGifts,
  getGifts,
  deleteAllGifts,
  getUserGiftsData,
};
