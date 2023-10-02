const promiseRouter = require("express-promise-router");
const {
	getUser,
	deleteUser,
	getAllUsers,
	updateUser,
	addUser,
	signIn,
	deleteAllUsers,
	sendOTP,
	verifyOTP,
	filterUsers,
	filteredUsersByInterests,
	login,
	addGift,
} = require("./controllers");
const path = require("path");
const multer = require("multer");
const { verifyJwtToken } = require("../../middleware/jwtTester");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// Specify the destination folder where the uploaded files will be stored
		cb(null, path.join(__dirname, "../../Images"));
	},
	filename: (req, file, cb) => {
		// Generate a unique filename for the uploaded file
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const fileExtension = path.extname(file.originalname);
		const fileName = file.fieldname + "-" + uniqueSuffix + fileExtension;
		cb(null, fileName);
	},
});
// Create the Multer upload object
const upload = multer({
	storage: storage,
	limits: { fileSize: 50 * 1024 * 1024 },
});
const router = promiseRouter();
const uploadImagesMiddleware = upload.array("profileImages");

router.post("/addUser", uploadImagesMiddleware, addUser);

router.post("/signIn", signIn);

router.get("/getUser/:id", getUser);

router.post("/login", login);

router.get("/getUsers", getAllUsers);

router.post("/filterUsers", filterUsers);

router.get("/filteredUsersByInterests", filteredUsersByInterests);

router.post("/sendOTP", sendOTP);

router.post("/verifyOTP", verifyOTP);

router.delete("/deleteUser/:userId", deleteUser);

router.delete("/deleteAllUsers", deleteAllUsers);

router.post("/updateUser/:userId", uploadImagesMiddleware, updateUser);

router.post("/addGift", addGift)

module.exports = router;
