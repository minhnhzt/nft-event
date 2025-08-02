const express = require('express');
const router = express.Router();
const mintController = require('../controllers/mintController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /mint:
 *   post:
 *     summary: Mint NFT for a participant
 *     tags: [Mint]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - participantId
 *             properties:
 *               eventId:
 *                 type: string
 *               participantId:
 *                 type: string
 *     responses:
 *       200:
 *         description: NFT minted for participant
 *       400:
 *         description: Validation failed
 */
/**
 * @swagger
 * /mint/bulk:
 *   post:
 *     summary: Mint NFT for multiple participants
 *     tags: [Mint]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - participantIds
 *             properties:
 *               eventId:
 *                 type: string
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: NFTs minted for participants
 *       400:
 *         description: Validation failed
 */
/**
 * @swagger
 * /mint:
 *   get:
 *     summary: Get mint history
 *     tags: [Mint]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of mint records
 */
/**
 * @swagger
 * /mint/stats:
 *   get:
 *     summary: Get mint statistics
 *     tags: [Mint]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mint statistics
 */
/**
 * @swagger
 * /mint/airdrop:
 *   post:
 *     summary: Airdrop SOL for testing
 *     tags: [Mint]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: Solana public key to receive SOL
 *               amount:
 *                 type: number
 *                 description: Amount of SOL to airdrop (default: 1)
 *     responses:
 *       200:
 *         description: SOL airdropped
 *       400:
 *         description: Public key is required
 *       403:
 *         description: Only admin can airdrop SOL
 */

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