const User = require('../models/User');
const Event = require('../models/Event');
const NFTTemplate = require('../models/NFTTemplate');
const MintRecord = require('../models/MintRecord');

// Dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalTemplates = await NFTTemplate.countDocuments();
    const totalMints = await MintRecord.countDocuments({ status: 'success' });
    
    // Recent activities
    const recentEvents = await Event.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(5);
      
    const recentMints = await MintRecord.find()
      .populate('user', 'username')
      .populate('event', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      stats: {
        totalUsers,
        totalEvents,
        totalTemplates,
        totalMints
      },
      recentActivities: {
        events: recentEvents,
        mints: recentMints
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// User management
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await User.countDocuments(query);
    
    res.json({
      users,
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

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role không hợp lệ' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Kiểm tra user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    
    // Kiểm tra user có events hoặc templates không
    const userEvents = await Event.countDocuments({ createdBy: userId });
    const userTemplates = await NFTTemplate.countDocuments({ creator: userId });
    
    if (userEvents > 0 || userTemplates > 0) {
      return res.status(400).json({ 
        message: 'Không thể xóa user đã có events hoặc templates',
        userEvents,
        userTemplates
      });
    }
    
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User đã được xóa' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Event management
exports.getAllEvents = async (req, res) => {
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
    if (createdBy) query.createdBy = createdBy;
    
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

// Template management
exports.getAllTemplates = async (req, res) => {
  try {
    const { page = 1, limit = 10, creator, search } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (creator) query.creator = creator;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const templates = await NFTTemplate.find(query)
      .populate('creator', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await NFTTemplate.countDocuments(query);
    
    res.json({
      templates,
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

// Mint management
exports.getAllMintRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, eventId, userId } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) query.status = status;
    if (eventId) query.event = eventId;
    if (userId) query.user = userId;
    
    const records = await MintRecord.find(query)
      .populate('user', 'username email solanaAddress')
      .populate('event', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await MintRecord.countDocuments(query);
    
    res.json({
      records,
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