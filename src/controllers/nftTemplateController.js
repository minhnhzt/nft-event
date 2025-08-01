const NFTTemplate = require('../models/NFTTemplate');

// Tạo mẫu NFT mới
exports.createNFTTemplate = async (req, res) => {
  try {
    const { name, description, metadata } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    if (!name || !imageUrl) {
      return res.status(400).json({ message: 'Name và image là bắt buộc' });
    }
    
    if (name.length < 3) {
      return res.status(400).json({ message: 'Tên phải có ít nhất 3 ký tự' });
    }
    
    const nftTemplate = new NFTTemplate({
      name,
      description,
      imageUrl,
      metadata: metadata ? JSON.parse(metadata) : {},
      creator: req.user._id,
    });
    await nftTemplate.save();
    
    // Populate creator info
    await nftTemplate.populate('creator', 'username email');
    res.status(201).json(nftTemplate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy danh sách mẫu NFT
exports.getNFTTemplates = async (req, res) => {
  try {
    const { page = 1, limit = 10, creator } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (creator) {
      query.creator = creator;
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

// Lấy chi tiết mẫu NFT
exports.getNFTTemplateById = async (req, res) => {
  try {
    const template = await NFTTemplate.findById(req.params.id).populate('creator', 'username email');
    if (!template) return res.status(404).json({ message: 'Không tìm thấy NFT Template' });
    res.json(template);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cập nhật NFT Template (chỉ creator hoặc admin)
exports.updateNFTTemplate = async (req, res) => {
  try {
    const { name, description, metadata } = req.body;
    const template = await NFTTemplate.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Không tìm thấy NFT Template' });
    }
    
    // Kiểm tra quyền
    if (template.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền cập nhật' });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (metadata) updateData.metadata = JSON.parse(metadata);
    
    const updatedTemplate = await NFTTemplate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('creator', 'username email');
    
    res.json(updatedTemplate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Xóa NFT Template (chỉ creator hoặc admin)
exports.deleteNFTTemplate = async (req, res) => {
  try {
    const template = await NFTTemplate.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Không tìm thấy NFT Template' });
    }
    
    // Kiểm tra quyền
    if (template.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xóa' });
    }
    
    await NFTTemplate.findByIdAndDelete(req.params.id);
    res.json({ message: 'NFT Template đã được xóa' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 