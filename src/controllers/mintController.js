const MintRecord = require('../models/MintRecord');
const Event = require('../models/Event');
const NFTTemplate = require('../models/NFTTemplate');
const { mintNFT, airdropSol } = require('../utils/solana');

// Validation helper
const validateMintData = (data) => {
  const errors = [];
  if (!data.eventId) {
    errors.push('Event ID là bắt buộc');
  }
  if (!data.participantId) {
    errors.push('Participant ID là bắt buộc');
  }
  return errors;
};

// Mint NFT cho participant
exports.mintNFTForParticipant = async (req, res) => {
  try {
    const { eventId, participantId } = req.body;
    
    // Validation
    const validationErrors = validateMintData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }
    
    const event = await Event.findById(eventId).populate('nftTemplate');
    if (!event) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    const participant = event.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({ message: 'Không tìm thấy participant' });
    }
    
    if (participant.status === 'minted') {
      return res.status(400).json({ message: 'Đã mint NFT cho participant này' });
    }
    
    // Kiểm tra quyền
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền mint NFT' });
    }
    
    // Gọi util mint NFT trên Solana Devnet
    const mintResult = await mintNFT({
      toPublicKey: participant.solanaAddress,
      metadataUrl: `${req.protocol}://${req.get('host')}${event.nftTemplate.imageUrl}`,
      name: event.nftTemplate.name,
      symbol: 'CERT',
    });
    
    if (!mintResult.success) {
      return res.status(500).json({ message: 'Lỗi mint NFT', error: mintResult.error });
    }
    
    // Lưu MintRecord
    const mintRecord = new MintRecord({
      user: participant.user,
      event: event._id,
      status: 'success',
      txHash: mintResult.txHash,
    });
    await mintRecord.save();
    
    // Cập nhật participant
    participant.status = 'minted';
    participant.mintedAt = new Date();
    await event.save();
    
    res.json({ 
      mintRecord, 
      participant,
      mintAddress: mintResult.mintAddress,
      txHash: mintResult.txHash
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mint NFT cho nhiều participants
exports.bulkMintNFT = async (req, res) => {
  try {
    const { eventId, participantIds } = req.body;
    
    if (!eventId || !participantIds || !Array.isArray(participantIds)) {
      return res.status(400).json({ message: 'Event ID và danh sách participant IDs là bắt buộc' });
    }
    
    const event = await Event.findById(eventId).populate('nftTemplate');
    if (!event) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    // Kiểm tra quyền
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền mint NFT' });
    }
    
    const results = [];
    const errors = [];
    
    for (const participantId of participantIds) {
      try {
        const participant = event.participants.id(participantId);
        if (!participant) {
          errors.push(`Participant ${participantId} không tồn tại`);
          continue;
        }
        
        if (participant.status === 'minted') {
          errors.push(`Participant ${participantId} đã được mint`);
          continue;
        }
        
        const mintResult = await mintNFT({
          toPublicKey: participant.solanaAddress,
          metadataUrl: `${req.protocol}://${req.get('host')}${event.nftTemplate.imageUrl}`,
          name: event.nftTemplate.name,
          symbol: 'CERT',
        });
        
        if (mintResult.success) {
          const mintRecord = new MintRecord({
            user: participant.user,
            event: event._id,
            status: 'success',
            txHash: mintResult.txHash,
          });
          await mintRecord.save();
          
          participant.status = 'minted';
          participant.mintedAt = new Date();
          
          results.push({
            participantId,
            success: true,
            txHash: mintResult.txHash,
            mintAddress: mintResult.mintAddress
          });
        } else {
          errors.push(`Lỗi mint NFT cho participant ${participantId}: ${mintResult.error}`);
        }
      } catch (err) {
        errors.push(`Lỗi xử lý participant ${participantId}: ${err.message}`);
      }
    }
    
    await event.save();
    
    res.json({
      success: results.length > 0,
      results,
      errors,
      summary: {
        total: participantIds.length,
        success: results.length,
        failed: errors.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy lịch sử mint
exports.getMintRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, eventId, userId } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    if (eventId) {
      query.event = eventId;
    }
    if (userId) {
      query.user = userId;
    }
    
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

// Lấy thống kê mint
exports.getMintStats = async (req, res) => {
  try {
    const { eventId } = req.query;
    
    let match = {};
    if (eventId) {
      match.event = eventId;
    }
    
    const stats = await MintRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalMinted = await MintRecord.countDocuments({ ...match, status: 'success' });
    const totalPending = await MintRecord.countDocuments({ ...match, status: 'pending' });
    const totalFailed = await MintRecord.countDocuments({ ...match, status: 'failed' });
    
    res.json({
      totalMinted,
      totalPending,
      totalFailed,
      breakdown: stats
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Airdrop SOL cho testing (chỉ dùng trên devnet)
exports.airdropSol = async (req, res) => {
  try {
    const { publicKey, amount = 1 } = req.body;
    
    if (!publicKey) {
      return res.status(400).json({ message: 'Public key là bắt buộc' });
    }
    
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền airdrop SOL' });
    }
    
    const result = await airdropSol(publicKey, amount);
    if (result.success) {
      res.json({ message: `Airdrop ${amount} SOL thành công`, signature: result.signature });
    } else {
      res.status(500).json({ message: 'Lỗi airdrop SOL', error: result.error });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 