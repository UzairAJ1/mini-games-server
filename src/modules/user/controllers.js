const { Users } = require("../../models/Users");

async function createUser(req,res)
{
    try {
        const { userName, user_id,token } = req.body;
    
        // Check if the ID is already taken
        const existingUser = await Users.findOne({ user_id,userName,token });
        if (existingUser) {
          return res.status(400).json({ message: 'ID is already taken' });
        }
    
        // Create a new user
        const user = new Users({ userName, user_id,token });
        await user.save();
        return res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
}

async function updateUser(req,res){
  try {
    const user_id = req.params.user_id;
    const updateData = req.body;

    // Ensure that 'userName' and 'userId' cannot be updated
    if ('userName' in updateData || 'user_id' in updateData) {
      return res.status(400).json({ message: 'userName and userId cannot be updated' });
    }

    const user = await Users.findOne({ user_id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    await Users.updateOne({ user_id }, { $set: updateData });
    return res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
module.exports={
    createUser,
    updateUser
}