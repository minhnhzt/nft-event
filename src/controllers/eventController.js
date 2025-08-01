
const Event = require('../models/Event');
const NFTTemplate = require('../models/NFTTemplate');

// Validation helper
const validateEventData = (data) => {
  const errors = [];
  if (!data.name || data.name.length < 3) {
    errors.push('Tên sự kiện phải có ít nhất 3 ký tự');
  }
  if (!data.nftTemplate) {
    errors.push('NFT Template là bắt buộc');
  }
  if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
    errors.push('Ngày kết thúc phải sau ngày bắt đầu');
  }
  return errors;
};

// Tạo sự kiện mới
exports.createEvent = async (req, res) => {
  try {
    const { name, description, nftTemplate, criteria, startDate, endDate } = req.body;
    
    // Validation
    const validationErrors = validateEventData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }
    
    // Kiểm tra NFT Template tồn tại
    const template = await NFTTemplate.findById(nftTemplate);
    if (!template) {
      return res.status(404).json({ message: 'NFT Template không tồn tại' });
    }
    
    const event = new Event({
      name,
      description,
      nftTemplate,
      criteria: criteria ? JSON.parse(criteria) : {},
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      createdBy: req.user._id,
    });
    
    await event.save();
    await event.populate('nftTemplate');
    await event.populate('createdBy', 'username email');
    
    res.status(201).json(event);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy danh sách sự kiện
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, createdBy } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) {
      const now = new Date();
      if (status === 'upcoming') {
        query.startDate = { $gt: now };
      } else if (status === 'ongoing') {
        query.startDate = { $lte: now };
        query.endDate = { $gte: now };
      } else if (status === 'ended') {
        query.endDate = { $lt: now };
      }
    }
    if (createdBy) {
      query.createdBy = createdBy;
    }
    
    const events = await Event.find(query)
      .populate('nftTemplate')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Event.countDocuments(query);
    
    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy chi tiết sự kiện
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('nftTemplate')
      .populate('createdBy', 'username email')
      .populate('participants.user', 'username email solanaAddress');
      
    if (!event) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    res.json(event);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cập nhật sự kiện
exports.updateEvent = async (req, res) => {
  try {
    const { name, description, criteria, startDate, endDate } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    // Kiểm tra quyền
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền cập nhật' });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (criteria) updateData.criteria = JSON.parse(criteria);
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('nftTemplate')
    .populate('createdBy', 'username email');
    
    res.json(updatedEvent);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Xóa sự kiện
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    // Kiểm tra quyền
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xóa' });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sự kiện đã được xóa' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Thêm participant vào event
exports.addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, solanaAddress, email } = req.body;
    
    if (!solanaAddress && !email) {
      return res.status(400).json({ message: 'Solana address hoặc email là bắt buộc' });
    }
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    // Kiểm tra quyền
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền thêm participant' });
    }
    
    // Kiểm tra participant đã tồn tại
    const existingParticipant = event.participants.find(p => 
      (p.solanaAddress && p.solanaAddress === solanaAddress) ||
      (p.email && p.email === email)
    );
    
    if (existingParticipant) {
      return res.status(400).json({ message: 'Participant đã tồn tại trong sự kiện' });
    }
    
    event.participants.push({ user, solanaAddress, email });
    await event.save();
    
    res.json(event.participants);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Xóa participant khỏi event
exports.removeParticipant = async (req, res) => {
  try {
    const { id, participantId } = req.params;
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    // Kiểm tra quyền
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xóa participant' });
    }
    
    const participant = event.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({ message: 'Không tìm thấy participant' });
    }
    
    participant.remove();
    await event.save();
    
    res.json({ message: 'Participant đã được xóa' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 