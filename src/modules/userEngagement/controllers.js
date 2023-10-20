const { UserEngagement } = require('../../models/UserEngagement');

// Create a new engagement
const createEngagement = async (req, res) => {
    try {
        const { userId } = req.body;

        // Check if an engagement already exists for the user on the current day
        const existingEngagement = await UserEngagement.findOne({
            userId,
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Get the start of the current day
                $lt: new Date(new Date().setHours(23, 59, 59, 999)), // Get the end of the current day
            },
        });

        if (existingEngagement) {
            return res.status(400).json({
                status: false,
                message: 'Engagement already exists for this user on the current day',
                data: null,
            });
        }

        // Create a new engagement if one doesn't already exist for the user on the current day
        const engagement = new UserEngagement({ userId });
        await engagement.save();
        res.status(200).json({
            status: true,
            message: 'Success',
            data: engagement,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: null,
        });
    }
};

// Get all engagements
const getAllEngagements = async (req, res) => {
    try {
        const engagements = await UserEngagement.find();
        res.status(200).json({
            status: true,
            message: 'Success',
            data: engagements,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: null,
        });
    }
};

// Get a specific engagement by ID
const getEngagementById = async (req, res) => {
    try {
        const { id } = req.params;
        const engagement = await UserEngagement.findById(id);
        if (!engagement) {
            return res.status(404).json({
                status: false,
                message: 'Engagement not found',
                data: null,
            });
        }
        res.status(200).json({
            status: true,
            message: 'Success',
            data: engagement,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: null,
        });
    }
};

// Update an engagement by ID
const updateEngagementById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEngagement = await UserEngagement.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedEngagement) {
            return res.status(404).json({
                status: false,
                message: 'Engagement not found',
                data: null,
            });
        }
        res.status(200).json({
            status: true,
            message: 'Success',
            data: updatedEngagement,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: null,
        });
    }
};

// Delete an engagement by ID
const deleteEngagementById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEngagement = await UserEngagement.findByIdAndDelete(id);
        if (!deletedEngagement) {
            return res.status(404).json({
                status: false,
                message: 'Engagement not found',
                data: null,
            });
        }
        res.status(204).json({
            status: true,
            message: 'Success',
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: null,
        });
    }
};

async function filterEngagementsByTime(req, res) {
    console.log("HERE ===")
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisWeek = new Date(today);
        thisWeek.setDate(thisWeek.getDate() - today.getDay());

        const thisMonth = new Date(today);
        thisMonth.setDate(1);

        const thisYear = new Date(today);
        thisYear.setMonth(0, 1);

        const engagementsDaily = await UserEngagement.find({
            createdAt: {
                $gte: today,
            },
        });

        const engagementsWeekly = await UserEngagement.find({
            createdAt: {
                $gte: thisWeek,
            },
        });

        const engagementsMonthly = await UserEngagement.find({
            createdAt: {
                $gte: thisMonth,
            },
        });

        const engagementsYearly = await UserEngagement.find({
            createdAt: {
                $gte: thisYear,
            },
        });

        const engagementsTotal = await UserEngagement.find();

        res.status(200).json({
            engagementsDaily,
            engagementsWeekly,
            engagementsMonthly,
            engagementsYearly,
            engagementsTotal,
        });
    } catch (error) {
        console.log("ERROR =====", error);
        res.status(500).json({ error: "Failed to get engagements" });
    }
}

module.exports = {
    createEngagement,
    getAllEngagements,
    getEngagementById,
    updateEngagementById,
    deleteEngagementById,
    filterEngagementsByTime
};
