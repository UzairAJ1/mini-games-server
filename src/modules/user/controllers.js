const { User } = require("../../models/User"); // Make sure to adjust the path accordingly
const fs = require("fs");

// Add user
async function addUser(req, res) {
  const uploadedImages = req.files;
  try {
    const userData = req.body;
    const { mobileNumber } = userData;
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      uploadedImages?.forEach((image) => {
        fs.unlink(image.path, (err) => {
          if (err) {
            console.log("Error deleting uploaded image:", err);
          }
        });
      });
      return res
        .status(400)
        .json({ error: "User with this mobile number already exists" });
    }
    let profileImages = [];
    if (uploadedImages?.length > 0) {
      profileImages = uploadedImages.map((image, index) => ({
        uri: image?.path,
        orderId: index + 1,
      }));
    }
    const newUser = new User({
      ...(userData?.mobileNumber && { mobileNumber: userData?.mobileNumber }),
      ...(userData?.fullName && { fullName: userData.fullName }),
      ...(userData?.dateOfBirth && { dateOfBirth: userData.dateOfBirth }),
      ...(userData?.gender && { gender: userData.gender }),
      ...(userData?.interests && {
        interests: JSON.parse(userData?.interests),
      }),
      ...(userData?.discreetMode && {
        discreetMode: JSON.parse(userData.discreetMode),
      }),
      ...(userData?.aboutYou && { aboutYou: userData.aboutYou }),
      ...(userData?.sexualOrientation && {
        sexualOrientation: userData?.sexualOrientation,
      }),
      ...(userData?.wantToSee && { wantToSee: userData?.wantToSee }),
      ...(userData?.lookingFor && { lookingFor: userData?.lookingFor }),
      ...(userData?.distance && { distance: userData?.distance }),
      ...(userData?.ageRange && { ageRange: JSON.parse(userData?.ageRange) }),
      ...(userData?.userType && { userType: userData?.userType }),
      ...(profileImages?.length > 0 && { profileImages: profileImages }),
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      data: savedUser,
      status: true,
      message: "User created successfully",
      status: 200,
    });
  } catch (error) {
    uploadedImages?.forEach((image) => {
      fs.unlink(image.path, (err) => {
        if (err) {
          console.log("Error deleting uploaded image:", err);
        }
      });
    });
    res.status(500).json({ error: "Failed to add user" });
  }
}

// Sign in
async function signIn(req, res) {
  try {
    const { mobileNumber } = req.body;
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // You can perform authentication checks here

    res.status(200).json({
      data: user,
      status: true,
      message: "User logged in successfully",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to sign in" });
  }
}

// SEND OTP

async function sendOTP(req, res) {
  try {
    // const { mobileNumber } = req.body;

    // You can perform authentication checks here
    res.status(200).json({
      status: true,
      message: "OTP sent to phone number",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to send otp" });
  }
}

// VERIFY CODE

async function verifyOTP(req, res) {
  console.log("GET DATA =======", req.body);

  try {
    const { mobileNumber, otp } = req.body;
    const user = await User.findOne({ mobileNumber });

    console.log("COMPLETE USER ========", user);
    if (otp != "1234") {
      res.status(500).json({ message: "Incorrect OTP", status: 500 });
      return;
    }
    let isComplete = false;
    if (
      user?.fullName &&
      user?.dateOfBirth &&
      user?.gender &&
      user?.interests?.length > 0 &&
      user?.profileImages?.length > 0 &&
      user?.discreetMode != null &&
      user?.subscriptionType &&
      user?.aboutYou &&
      user?.sexualOrientation &&
      user?.lookingFor &&
      user?.wantToSee &&
      user?.distance &&
      user?.ageRange
    ) {
      console.log("IM HERE COMPLETE ");
      isComplete = true;
    }
    if (!user) {
      const newUser = new User({ mobileNumber });
      const savedUser = await newUser.save();
      res.status(201).json({
        data: { ...savedUser?._doc, isComplete },
        status: true,
        message: "User created successfully",
        status: 200,
      });
    } else {
      res.status(200).json({
        data: { ...user?._doc, isComplete },
        status: true,
        message: "User logged in successfully",
        status: 200,
      });
    }
    // You can perform authentication checks here
  } catch (error) {
    res.status(500).json({ error: "Failed to verify otp", status: 500 });
  }
}

// Get single user
async function getUser(req, res) {
  try {
    const userId = req.params.id; // Assuming you're passing the user ID as a parameter
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    let isComplete = false;
    if (
      user?.fullName &&
      user?.dateOfBirth &&
      user?.gender &&
      user?.interests?.length > 0 &&
      user?.profileImages?.length > 0 &&
      user?.discreetMode != null &&
      user?.subscriptionType &&
      user?.aboutYou &&
      user?.sexualOrientation &&
      user?.lookingFor &&
      user?.wantToSee &&
      user?.distance &&
      user?.ageRange
    ) {
      console.log("IM HERE COMPLETE ");
      isComplete = true;
    }
    res.status(200).json({
      data: { ...user?._doc, isComplete },
      status: true,
      message: "success",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body; // Assuming you're passing the user ID as a parameter
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Both email and password are required" });
    }

    const user = await User.findOne({ email: email });

    console.log({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user) {
      console.log({ user });
      if (user.password == password) {
        res.status(200).json({
          data: user,
          status: true,
          message: "User data",
          status: 200,
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid Credentials",
          status: 401,
        });
      }
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: "Failed to get user" });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const userId = req.params.userId; // Assuming you're passing the user ID as a parameter
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
}

// Get All Users
async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({
      data: users,
      status: true,
      message: "All users data",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
}

async function filterUsers(req, res) {
  try {
    const { gender, ageRange, distance, interests } = req.body;

    let filters = {};

    if (ageRange) {
      filters.$and = [
        { "ageRange.start": { $lte: ageRange.end } },
        { "ageRange.end": { $gte: ageRange.start } },
      ];
    }
    if (gender) {
      filters.gender = gender;
    }

    if (interests) {
      const interestsArray = interests.split(",");
      filters.interests = { $in: interestsArray };
    }

    console.log("FILTERS =======", filters);
    const filteredUsers = await User.find(filters);

    res.status(200).json({
      data: filteredUsers,
      status: true,
      message: "Filtered User Data",
      totalFiltered: filteredUsers.length,
      status: 200,
    });
  } catch (error) {
    console.log("THE ERROR ===========", error);
    res.status(500).json({
      message: error.message,
    });
  }
}

async function filteredUsersByInterests(req, res) {
  const filteredUsers = await User.find({
    ageRange: {
      start: 20,
      end: 28,
    },
  });
}

async function deleteAllUsers(req, res) {
  try {
    await User.deleteMany();
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete all user" });
  }
}

async function updateUser(req, res) {
  const uploadedImages = req.files;
  const userId = req.params.userId; // Assuming you're passing the user ID as a parameter

  try {
    const userData = req.body;
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      uploadedImages?.forEach((image) => {
        fs.unlink(image.path, (err) => {
          if (err) {
            console.log("Error deleting uploaded image:", err);
          }
        });
      });
      return res.status(404).json({ error: "User not found" });
    }

    // Update user properties
    existingUser.fullName = userData.fullName || existingUser.fullName;
    existingUser.dateOfBirth = userData.dateOfBirth || existingUser.dateOfBirth;
    existingUser.gender = userData.gender || existingUser.gender;
    existingUser.interests = userData.interests
      ? JSON.parse(userData.interests)
      : existingUser.interests;
    existingUser.discreetMode = userData.discreetMode
      ? JSON.parse(userData.discreetMode)
      : existingUser.discreetMode;
    existingUser.aboutYou = userData.aboutYou || existingUser.aboutYou;
    existingUser.sexualOrientation =
      userData.sexualOrientation || existingUser.sexualOrientation;
    existingUser.wantToSee = userData.wantToSee || existingUser.wantToSee;
    existingUser.lookingFor = userData.lookingFor || existingUser.lookingFor;
    existingUser.distance = userData.distance || existingUser.distance;
    existingUser.ageRange = userData.ageRange
      ? JSON.parse(userData.ageRange)
      : existingUser.ageRange;
    existingUser.userType = userData.userType || existingUser.userType;
    existingUser.subscriptionType =
      userData.subscriptionType || existingUser.subscriptionType;

    // Update profile images if uploaded
    if (uploadedImages?.length > 0) {
      existingUser.profileImages = uploadedImages.map((image, index) => ({
        uri: image?.path,
        orderId: index + 1,
      }));
    }
    const updatedUser = await existingUser.save();
    console.log("UPDATED USER ===========", updatedUser);
    let isComplete = false;
    if (
      updatedUser?.fullName &&
      updatedUser?.dateOfBirth &&
      updatedUser?.gender &&
      updatedUser?.interests?.length > 0 &&
      updatedUser?.profileImages?.length > 0 &&
      updatedUser?.discreetMode != null &&
      updatedUser?.subscriptionType &&
      updatedUser?.aboutYou &&
      updatedUser?.sexualOrientation &&
      updatedUser?.lookingFor &&
      updatedUser?.wantToSee &&
      updatedUser?.distance &&
      updatedUser?.ageRange
    ) {
      console.log("IM HERE COMPLETE ");
      isComplete = true;
    }
    res.status(200).json({
      data: { ...updatedUser?._doc, isComplete },
      status: true,
      message: "User updated successfully",
      status: 200,
    });
  } catch (error) {
    console.log("ERROR =======", error);
    uploadedImages?.forEach((image) => {
      console.log("THE IMAGES ======", image?.path);
      fs.unlink(image.path, (err) => {
        if (err) {
          console.log("Error deleting uploaded image:", err);
        }
      });
    });
    res.status(500).json({ error: "Failed to update user" });
  }
}

const usersStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const maleUsers = await User.countDocuments({ gender: "male" });
    const femaleUsers = await User.countDocuments({ gender: "female" });

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: twoWeeksAgo },
    });

    const userStatistics = {
      totalUsers,
      maleUsers,
      femaleUsers,
      newUsers,
    };

    res.status(200).json({
      data: userStatistics,
      status: true,
      message: "User Statistics",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getUser,
  login,
  deleteUser,
  getAllUsers,
  addUser,
  signIn,
  deleteAllUsers,
  sendOTP,
  verifyOTP,
  updateUser,
  filterUsers,
  filteredUsersByInterests,
  usersStats,
};
