const { Matches } = require("../../models/Matches"); // Import your Matches model

async function createMatch(req, res) {
  try {
    const { matchedUsers } = req.body;
    const newMatch = await Matches.create({ matchedUsers });
    res.status(201).json({
      status: true,
      message: "Match created successfully.",
      data: newMatch,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while creating the match.",
      data: null,
    });
  }
}

async function getAllMatches(req, res) {
  try {
    const matches = await Matches.find();
    res.status(200).json({
      status: true,
      message: "Matches retrieved successfully.",
      data: matches,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving matches.",
      data: null,
    });
  }
}

async function getMatchById(req, res) {
  const { id } = req.params;
  try {
    const match = await Matches.findById(id);
    if (!match) {
      res.status(404).json({
        status: false,
        message: "Match not found.",
        data: null,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Match retrieved successfully.",
        data: match,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the match.",
      data: null,
    });
  }
}

async function updateMatchById(req, res) {
  const { id } = req.params;
  const { matchedUsers } = req.body;
  try {
    const updatedMatch = await Matches.findByIdAndUpdate(id, { matchedUsers }, { new: true });
    if (!updatedMatch) {
      res.status(404).json({
        status: false,
        message: "Match not found.",
        data: null,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Match updated successfully.",
        data: updatedMatch,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the match.",
      data: null,
    });
  }
}

async function deleteMatchById(req, res) {
  const { id } = req.params;
  try {
    const deletedMatch = await Matches.findByIdAndDelete(id);
    if (!deletedMatch) {
      res.status(404).json({
        status: false,
        message: "Match not found.",
        data: null,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Match deleted successfully.",
        data: deletedMatch,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the match.",
      data: null,
    });
  }
}

module.exports = {
  createMatch,
  getAllMatches,
  getMatchById,
  updateMatchById,
  deleteMatchById
};
