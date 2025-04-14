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

exports.getServiceRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateServiceRequest = async (req, res) => {
  try {
    const updated = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Request not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteServiceRequest = async (req, res) => {
  try {
    const deleted = await ServiceRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
