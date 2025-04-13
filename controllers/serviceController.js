const ServiceRequest = require('../models/ServiceRequest');

exports.createServiceRequest = async (req, res) => {
  try {
    const request = new ServiceRequest({ ...req.body });
    await request.save();
    res.status(201).json(request);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getServiceRequest = async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};