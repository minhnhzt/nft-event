const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  nftTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'NFTTemplate', required: true },
  criteria: { type: Object }, // điều kiện tham gia
  startDate: { type: Date },
  endDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    solanaAddress: { type: String },
    email: { type: String },
    status: { type: String, enum: ['pending', 'minted', 'failed'], default: 'pending' },
    mintedAt: { type: Date }
  }],
});

module.exports = mongoose.model('Event', eventSchema); 