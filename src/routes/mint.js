const express = require('express');
const router = express.Router();
const mintController = require('../controllers/mintController');
const auth = require('../middlewares/auth');

// Mint NFT cho participant
router.post('/', auth, auth.getUser, mintController.mintNFTForParticipant);
// Mint NFT cho nhiều participants
router.post('/bulk', auth, auth.getUser, mintController.bulkMintNFT);
// Lấy lịch sử mint
router.get('/', auth, auth.getUser, mintController.getMintRecords);
// Lấy thống kê mint
router.get('/stats', auth, auth.getUser, mintController.getMintStats);
// Airdrop SOL cho testing
router.post('/airdrop', auth, auth.getUser, mintController.airdropSol);

module.exports = router; 