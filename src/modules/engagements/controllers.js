const { engagements } = require("../../models/Engagement");

async function addEngagement(req, res) {
  const { userId } = req.body;
  const today = new Date().setHours(0, 0, 0, 0);
  try {
    // Check if there's an engagement record for the user on the current day
    let engagement = await engagements.findOne({
      _id: userId,
      createdAt: today,
    });

    if (!engagement) {
      // If there's no engagement record for today, create a new one
      engagement = new engagements({ userId, createdAt: today, engages: 1 });
    } else {
      // If there's an engagement record for today, increment the engages count by 1
      engagement.engages += 1;
    }

    // Save the engagement record
    await engagement.save();

    res
      .status(200)
      .json({ message: "Engages increased by 1 for the user for one day." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function showEngagements(req, res) {
  const { userId } = req.body;

  try {
    let engagements = await find({});
  } catch (error) {}
}
async function showAllEngagements(req, res) {
  try {
    let engagements = find;
  } catch (error) {}
}
module.exports = {
  addEngagement,
};
