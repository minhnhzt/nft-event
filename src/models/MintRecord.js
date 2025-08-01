const mongoose = require('mongoose');

const mintRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  txHash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MintRecord', mintRecordSchema); 