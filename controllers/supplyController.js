const SupplyRequest = require('../models/SupplyRequest');

exports.createSupplyRequest = async (req, res) => {
  try {
    const request = new SupplyRequest({ ...req.body, requestedBy: req.user.id });
    await request.save();
    res.status(201).json(request);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSupplyRequests = async (req, res) => {
  try {
    const requests = await SupplyRequest.find().populate('requestedBy', 'name email');
    res.json(requests);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveSupplyRequest = async (req, res) => {
  try {
    const request = await SupplyRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Supply request not found' });
    }
    request.status = 'approved';
    await request.save();
    res.json({ message: 'Supply request approved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectSupplyRequest = async (req, res) => {
  try {
    const request = await SupplyRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Supply request not found' });
    }
    request.status = 'rejected';
    await request.save();
    res.json({ message: 'Supply request rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};