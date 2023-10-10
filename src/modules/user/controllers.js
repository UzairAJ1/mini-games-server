const { User } = require("../../models/User"); // Make sure to adjust the path accordingly
const fs = require("fs");
const moment = require("moment");
const jwt = require("jsonwebtoken");

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
      // user?.interests?.length > 0 &&
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
      // user?.interests?.length > 0 &&
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
        const token = jwt.sign({ sub: user._id }, process.env.JWTTOKEN);
        res.status(200).json({
          data: { ...user._doc, token },
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
    const { gender, ageRange, distance, interests, location } = req.body;
    let filters = {};
    filters.discreetMode = false;

    if (ageRange) {
      const today = new Date();
      const startYear = today.getFullYear() - ageRange.end;
      const endYear = today.getFullYear() - ageRange.start;
      const startDateOfBirth = new Date(
        startYear,
        today.getMonth(),
        today.getDate()
      );
      const endDateOfBirth = new Date(
        endYear,
        today.getMonth(),
        today.getDate()
      );
      filters.dateOfBirth = {
        $gte: startDateOfBirth,
        $lte: endDateOfBirth,
      };
    }

    if (gender) {
      filters.gender = gender;
    }

    if (interests) {
      const interestsArray = interests.split(",");
      filters.interests = { $in: interestsArray };
    }

    // if (location) {
    // 	const { lat, long } = location;
    // 	const maxDistance = 10 * 1000; // 10 km in meters
    // 	filters.location = {
    // 		$geoWithin: {
    // 			$centerSphere: [[long, lat], maxDistance / 6371] // Earth's radius is approximately 6371 km
    // 		}
    // 	};
    // }

    console.log("FILTERS =======", filters);
    const filteredUsers = await User.find(filters);

    res.status(200).json({
      data: filteredUsers,
      status: true,
      message: "Filtered User Data",
      totalFiltered: filteredUsers.length,
      appliedFilters: req.body,
      status: 200,
    });
  } catch (error) {
    console.log("THE ERROR ===========", error);
    res.status(500).json({
      message: error.message,
    });
  }
}

// OR CONDITION FILTER BELOW

// async function filterUsers(req, res) {
// 	try {
// 		const { gender, ageRange, distance, interests, location } = req.body;
// 		console.log("COMPLETE FILTERS ========", req.body);
// 		let filters = {};

// 		const orConditions = []; // Initialize an array for $or conditions

// 		if (ageRange) {
// 			orConditions.push({
// 				$and: [
// 					{ 'ageRange.start': { $lte: ageRange.end } },
// 					{ 'ageRange.end': { $gte: ageRange.start } }
// 				]
// 			});
// 		}

// 		if (gender) {
// 			orConditions.push({ gender: gender });
// 		}

// 		if (interests) {
// 			const interestsArray = interests.split(",");
// 			orConditions.push({ interests: { $in: interestsArray } });
// 		}

// 		if (orConditions.length > 0) {
// 			// If there are $or conditions, set them in the filters
// 			filters.$or = orConditions;
// 		}

// 		console.log("FILTERS =======", filters);
// 		const filteredUsers = await User.find(filters);

// 		res.status(200).json({
// 			data: filteredUsers,
// 			status: true,
// 			message: "Filtered User Data",
// 			totalFiltered: filteredUsers.length,
// 			appliedFilters: req.body,
// 			status: 200,
// 		});
// 	} catch (error) {
// 		console.log("THE ERROR ===========", error);
// 		res.status(500).json({
// 			message: error.message
// 		});
// 	}
// }

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
    let orderIds = [];
    if (req?.body?.orderIds) {
      orderIds = JSON.parse(req?.body?.orderIds);
    }
    console.log("GET ORDER IDS ======", orderIds);
    console.log("FILES ==========", uploadedImages);

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
    existingUser.location = userData.location
      ? JSON.parse(userData.location)
      : existingUser.location;
    existingUser.userType = userData.userType || existingUser.userType;
    existingUser.subscriptionType =
      userData.subscriptionType || existingUser.subscriptionType;
    // Update profile images if uploaded
    // if (uploadedImages?.length > 0 && orderIds?.length > 0) {
    // 	existingUser.profileImages = uploadedImages.map((image, index) => ({
    // 		uri: image?.path,
    // 		orderId: orderIds[index],
    // 	}));
    // }
    if (uploadedImages?.length > 0 && orderIds?.length > 0) {
      const newProfileImages = uploadedImages.map((image, index) => ({
        uri: image?.path,
        orderId: orderIds[index],
      }));
      for (const existingImage of existingUser.profileImages) {
        if (
          newProfileImages.some(
            (newImage) => newImage.orderId === existingImage.orderId
          )
        ) {
          fs.unlink(existingImage.uri, (err) => {
            if (err) {
              console.log("Error deleting existing image:", err);
            }
          });
          existingUser.profileImages = existingUser.profileImages.filter(
            (image) => image.orderId !== existingImage.orderId
          );
        }
      }
      existingUser.profileImages =
        existingUser.profileImages.concat(newProfileImages);
    }
    const updatedUser = await existingUser.save();
    console.log("UPDATED USER ===========", updatedUser);
    let isComplete = false;
    if (
      updatedUser?.fullName &&
      updatedUser?.dateOfBirth &&
      updatedUser?.gender &&
      // updatedUser?.interests?.length > 0 &&
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

async function addGift(req, res) {
  try {
    const { type, text, userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const gift = {
      type,
      text,
    };
    user.myGiftsCollection.push(gift);
    await user.save();

    res.status(200).json({
      status: true,
      message: "Gift added successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while adding gift for the user.",
      data: null,
    });
  }
}
const usersStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const maleUsers = await User.countDocuments({ gender: "male" });
    const femaleUsers = await User.countDocuments({ gender: "female" });

    const activeUsers = (await User.find()).filter(
      (user) => user.status === "active"
    ).length;

    const twoWeeksAgo = moment().subtract(2, "weeks").toDate();

    const newUsers = await User.countDocuments({
      createdAt: { $gte: twoWeeksAgo, $lte: new Date() },
    });

    const userStatistics = {
      totalUsers,
      maleUsers,
      femaleUsers,
      activeUsers,
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

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!userId || !status) {
      return res
        .status(400)
        .json({ message: "User ID and status are required" });
    }

    if (!["active", "banned"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const genderDistribution = async (req, res) => {
  try {
    const totalCount = await User.aggregate([
      {
        $group: {
          _id: { $toLower: "$gender" }, // Convert gender to lowercase
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      totalFemales: 0,
      totalMales: 0,
    };

    totalCount.forEach((item) => {
      const gender = item._id;
      if (gender === "female" || gender === "f") {
        result.totalFemales += item.count;
      } else if (gender === "male" || gender === "m") {
        result.totalMales += item.count;
      }
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error recieved" });
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
  addGift,
  usersStats,
  updateUserStatus,
  genderDistribution,
};
