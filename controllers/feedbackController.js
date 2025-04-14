const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeedbackByProposalId = async (req, res) => {
  try {
    const feedback = await Feedback.find({ proposalId: req.params.proposalId });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
