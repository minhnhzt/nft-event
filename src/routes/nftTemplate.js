const express = require('express');
const router = express.Router();
const nftTemplateController = require('../controllers/nftTemplateController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Tạo mẫu NFT mới (có upload ảnh)
router.post('/', auth, auth.getUser, upload.single('image'), nftTemplateController.createNFTTemplate);
// Lấy danh sách mẫu NFT
router.get('/', nftTemplateController.getNFTTemplates);
// Lấy chi tiết mẫu NFT
router.get('/:id', nftTemplateController.getNFTTemplateById);
// Cập nhật NFT Template
router.put('/:id', auth, auth.getUser, nftTemplateController.updateNFTTemplate);
// Xóa NFT Template
router.delete('/:id', auth, auth.getUser, nftTemplateController.deleteNFTTemplate);

module.exports = router; 