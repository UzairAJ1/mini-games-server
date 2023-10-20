const { User } = require("../../models/User"); // Make sure to adjust the path accordingly
const { Likes } = require("../../models/Likes");
const fs = require("fs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { GlobalSettings } = require("../../models/GlobalSettings");
const { default: mongoose } = require("mongoose");

// Add user
const giftOptions = [
	{ type: "flower", text: "flower" },
	{ type: "rose", text: "rose" },
	{ type: "heart", text: "heart" }
];

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
			const globalSettings = await GlobalSettings.findOne();
			const numberOfFreeGifts = globalSettings?.giftInteractionLimit?.freeGifts || 0;


			const freeGifts = [];
			for (let i = 0; i < numberOfFreeGifts; i++) {
				// Randomly select a gift from the giftOptions array
				const randomGift = giftOptions[Math.floor(Math.random() * giftOptions.length)];

				// Add the selected gift to the free gifts array
				freeGifts.push({
					type: randomGift.type,
					text: randomGift.text,
				});
			}
			console.log("FREE GIRFT======", freeGifts)
			// Add the free gifts to the user's myGiftsCollection
			newUser.myGiftsCollection = freeGifts;

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

		const today = new Date();
		today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1); // Set the time to the beginning of the next day
		console.log("TODAY ========", today);
		const userLikes = await Likes.find({
			likerUserId: userId,
			createdAt: {
				$gte: today,
				$lt: tomorrow,
			},
		});

		let isComplete = false;
		if (
			user?.fullName &&
			user?.dateOfBirth &&
			user?.gender &&
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
			data: { ...user?._doc, isComplete, givenLikes: userLikes },
			status: true,
			message: "success",
			status: 200,
		});
	} catch (error) {
		console.log("ERROR =====", error);
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
		console.log("user:", user);
		if (user.status !== "active") {
			res.status(404).json({ message: "This User is Banned" });
			return;
		}
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

async function filterUserByTime(req, res) {
	try {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

		const thisWeek = new Date(today); // Start with the current date
		thisWeek.setDate(thisWeek.getDate() - today.getDay()); // Set the time to the beginning of the week

		const thisMonth = new Date(today); // Start with the current date
		thisMonth.setDate(1); // Set the time to the beginning of the month

		const thisYear = new Date(today); // Start with the current date
		thisYear.setMonth(0, 1); // Set the time to the beginning of the year

		// Use the find method to filter users created within the specified time frames.
		const usersDaily = await User.find({
			createdAt: {
				$gte: today,
			},
		});

		const usersWeekly = await User.find({
			createdAt: {
				$gte: thisWeek,
			},
		});

		const usersMonthly = await User.find({
			createdAt: {
				$gte: thisMonth,
			},
		});

		const usersYearly = await User.find({
			createdAt: {
				$gte: thisYear,
			},
		});

		const usersTotal = await User.find();

		const countGenders = (users) => {
			const maleCount = users.filter((user) => user.gender === "male").length;
			const femaleCount = users.filter(
				(user) => user.gender === "female"
			).length;
			return { male: maleCount, female: femaleCount };
		};

		const gendersDaily = countGenders(usersDaily);
		const gendersWeekly = countGenders(usersWeekly);
		const gendersMonthly = countGenders(usersMonthly);
		const gendersYearly = countGenders(usersYearly);
		const gendersTotal = countGenders(usersTotal);

		res.status(200).json({
			usersDaily,
			usersWeekly,
			usersMonthly,
			usersYearly,
			usersTotal,
			gendersDaily,
			gendersWeekly,
			gendersMonthly,
			gendersYearly,
			gendersTotal,
		});
	} catch (error) {
		console.log("ERROR =====", error);
		res.status(500).json({ error: "Failed to get users" });
	}
}

async function usersByMonths(req, res) {
	try {
		const usersByMonth = await User.aggregate([
			{
				$group: {
					_id: { $month: "$createdAt" },
					count: { $sum: 1 },
				},
			},
		]);

		const result = {};

		usersByMonth.forEach((monthData) => {
			const monthNumber = monthData._id;

			if (monthNumber >= 1 && monthNumber <= 12) {
				// Check if the month number is valid (between 1 and 12)
				const year = moment().year(); // Get the current year
				const formattedDate = moment([year, monthNumber - 1, 1]).format(
					"MM/DD/YYYY"
				);
				result[formattedDate] = monthData.count.toString();
			}
		});

		res.json(result);
	} catch (error) {
		res.status(500).json({ error: "An error occurred" });
	}
}

async function filterUsers(req, res) {
	try {

		const { gender, ageRange, distance, interests, location, userId } = req.body;
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

		// const filteredUsers = await User.aggregate([
		// 	{ $match: filters },
		// 	{
		// 		$lookup: { from: 'likes', localField: '_id', foreignField: 'likedUserId', as: 'likes', }
		// 	}, { $addFields: { likesCount: { $size: '$likes' } } },
		// ]);

		const filteredUsers = await User.aggregate([
			{ $match: filters },
			{
				$lookup: { from: 'likes', localField: '_id', foreignField: 'likedUserId', as: 'likes', }
			},
			{ $addFields: { likesCount: { $size: '$likes' } } },
			{
				$addFields: {
					likedByCurrentUser: {
						$in: [userId ? mongoose.Types.ObjectId(userId) : "", '$likes.likerUserId']
					}
				}
			}
		]);


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
		existingUser.userEngagementMinutes =
			userData.userEngagementMinutes || existingUser.userEngagementMinutes;
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
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1); // Set the time to the beginning of the next day
		console.log("TODAY ========", today);
		const userLikes = await Likes.find({
			likerUserId: userId,
			createdAt: {
				$gte: today,
				$lt: tomorrow,
			},
		});
		res.status(200).json({
			data: { ...updatedUser?._doc, isComplete, givenLikes: userLikes },
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

const activeUsersStats = async (req, res) => {
	try {
		// Daily Active Users
		const activeUsersPerDay = await User.aggregate([
			{
				$match: {
					status: "active",
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
					_id: "$formattedDate",
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		// Monthly Active Users
		const activeUsersPerMonth = await User.aggregate([
			{
				$match: {
					status: "active",
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
					_id: "$formattedDate",
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		// Total Active Users
		const totalActiveUsers = await User.countDocuments({ status: "active" });

		const activeUsersStatistics = {
			totalActiveUsers,
			activeUsersPerDay,
			activeUsersPerMonth,
		};

		res.status(200).json({
			data: activeUsersStatistics,
			status: true,
			message: "Active Users Statistics",
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "An error occurred while retrieving active users statistics.",
			data: null,
		});
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
		// Total Gender Distribution
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

		// Daily Gender Distribution
		const dailyGenderDistribution = await User.aggregate([
			{
				$match: {
					status: "active",
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
						gender: { $toLower: "$gender" }, // Convert gender to lowercase
						formattedDate: "$formattedDate",
					},
					count: { $sum: 1 },
				},
			},
			{
				$sort: { "_id.formattedDate": 1 },
			},
		]);

		// Monthly Gender Distribution
		const monthlyGenderDistribution = await User.aggregate([
			{
				$match: {
					status: "active",
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
						gender: { $toLower: "$gender" }, // Convert gender to lowercase
						formattedDate: "$formattedDate",
					},
					count: { $sum: 1 },
				},
			},
			{
				$sort: { "_id.formattedDate": 1 },
			},
		]);

		// Calculate total daily active males and females
		const totalDailyActive = dailyGenderDistribution.reduce(
			(acc, item) => {
				if (item._id.gender === "female") {
					acc.females += item.count;
				} else if (item._id.gender === "male") {
					acc.males += item.count;
				}
				return acc;
			},
			{ males: 0, females: 0 }
		);

		// Calculate total monthly active males and females
		const totalMonthlyActive = monthlyGenderDistribution.reduce(
			(acc, item) => {
				if (item._id.gender === "female") {
					acc.females += item.count;
				} else if (item._id.gender === "male") {
					acc.males += item.count;
				}
				return acc;
			},
			{ males: 0, females: 0 }
		);

		const genderStatistics = {
			total: result,
			daily: dailyGenderDistribution,
			monthly: monthlyGenderDistribution,
			totalDailyActive,
			totalMonthlyActive,
		};

		res.json(genderStatistics);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error received" });
	}
};

async function zodiacSpin(req, res) {
	const { userId, spinnedUsers } = req.body;
	try {
		const user = await User.findById(userId);
		const globalSettings = await GlobalSettings.findOne();
		const { zodiacLimit, zodiacTimeLimit } = globalSettings;

		if (user.remainingSpins === 0) {
			if (user.spinsTimeoutDate && user.spinsTimeoutDate > new Date()) {
				console.log("WAITING ")
				return res.status(400).json({
					status: false,
					message: "Please wait until the timeout is finished.",
					data: null,
					remainingSpins: user.remainingSpins,
					spinsTimeoutDate: user.spinsTimeoutDate
				});
			} else {
				user.remainingSpins = zodiacLimit;
				user.spinsTimeoutDate = zodiacTimeLimit;
			}
		}
		function arraysAreEqual(arr1, arr2) {
			return JSON.stringify(arr1) === JSON.stringify(arr2);
		}


		if (user.remainingSpins > 1) {
			// if (!arraysAreEqual(user.spinnedUsers, spinnedUsers)) {
			// 	return res.status(400).json({
			// 		status: false,
			// 		message: "Spinned users not same as last spin",
			// 		data: null,
			// 	});
			// }
			console.log("HERE =====")
			user.remainingSpins -= 1;
			user.spinnedUsers = spinnedUsers
		} else if (user.remainingSpins === 1) {
			// if (!arraysAreEqual(user.spinnedUsers, spinnedUsers)) {
			// 	return res.status(400).json({
			// 		status: false,
			// 		message: "Spinned users not same as last spin",
			// 		data: null,
			// 	});
			// }
			console.log("HERE 222====")
			user.remainingSpins -= 1;
			user.spinsTimeoutDate = new Date(Date.now() + zodiacTimeLimit * 60000);
			user.spinnedUsers = []
		}

		const updatedUser = await user.save();

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
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1); // Set the time to the beginning of the next day
		const userLikes = await Likes.find({
			likerUserId: userId,
			createdAt: {
				$gte: today,
				$lt: tomorrow,
			},
		});

		res.status(200).json({
			status: true,
			message: "Spin Successful",
			data: { ...updatedUser?._doc, isComplete, givenLikes: userLikes },
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "An error occurred while liking the user.",
			data: null,
		});
	}
}


module.exports = {
	zodiacSpin,
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
	filterUserByTime,
	usersByMonths,
	activeUsersStats,
	zodiacSpin
};
