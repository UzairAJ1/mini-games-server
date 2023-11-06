const { Users } = require("../../models/Users");

async function createUser(req, res) {
  try {
    const { userName, token } = req.body;

    // Check if the ID is already taken
    const existingUser = await Users.findOne({ userName, token });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "You have signed In",
          status: 400,
          user: existingUser,
        });
    } else {
      const user = new Users({ userName, token });
      await user.save();
      return res.status(201).json({
        message: "User registered successfully",
        status: 201,
        user: user,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { userName, token } = req.body;

    // Check if the user with the provided userName and token exists
    const user = await Users.findOne({ userName, token });

    if (!user) {
      return res.status(401).json({ message: "Invalid userName or token" });
    }

    // You can add additional checks or validation here if needed.

    return res
      .status(200)
      .json({ message: "User logged in successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateUser(req, res) {
  try {
    const userName = req.params.userName;
    const updateData = req.body;
    console.log("user coming :", updateData);
    // Ensure that 'userName' and 'userId' cannot be updated
    if ("userName" in updateData) {
      return res.status(400).json({ message: "userName  cannot be updated" });
    }

    const user = await Users.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    await Users.updateOne({ userName }, { $set: updateData });
    return res
      .status(200)
      .json({ message: "User details updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = {
  createUser,
  updateUser,
  loginUser,
};
