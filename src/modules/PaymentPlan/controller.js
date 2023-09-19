const { PaymentPlan } = require("../../models/PaymentPlan");

const addPaymentPlan = async (req, res) => {
  try {
    const { name, description, amount, likesLimit, resetDuration } = req.body;

    const paymentPlan = new PaymentPlan({
      name,
      description,
      amount,
      likesLimit,
      resetDuration,
    });

    await paymentPlan.save();

    res.status(200).json({
      status: true,
      message: "Payment plan added successfully.",
      data: paymentPlan,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment plan." });
  }
};

const getPaymentPlans = async (req, res) => {
  try {
    const paymentPlans = await PaymentPlan.find();

    res.status(200).json({
      status: true,
      message: "Payment Plans retrieved successfully.",
      data: paymentPlans,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve payment plans." });
  }
};

const updatePaymentPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlan = req.body;

    const plan = await PaymentPlan.findByIdAndUpdate(id, updatedPlan, {
      new: true,
    });

    if (!plan) {
      return res
        .status(404)
        .json({ success: false, error: "Payment plan not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment plan updated successfully.",
      data: plan,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to update payment plan" });
  }
};

const deletePaymentPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPlan = await PaymentPlan.findByIdAndRemove(id);

    if (!deletedPlan) {
      return res
        .status(404)
        .json({ success: false, error: "Payment plan not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment plan deleted successfully.",
      data: deletedPlan,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete payment plan" });
  }
};

module.exports = {
  addPaymentPlan,
  getPaymentPlans,
  updatePaymentPlan,
  deletePaymentPlan,
};
