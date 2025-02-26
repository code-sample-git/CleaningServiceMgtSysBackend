const QAReport = require('../models/QAReport');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.createReport = async (req, res) => {
  try {
    const report = new QAReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generatePDFReport = async (req, res) => {
  try {
    const report = await QAReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, '..', 'proposals', `QAReport-${Date.now()}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text('Quality Assurance Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Location: ${report.location}`);
    doc.text(`Report Details: ${report.reportData}`);
    doc.end();

    writeStream.on('finish', () => {
      res.download(filePath);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};