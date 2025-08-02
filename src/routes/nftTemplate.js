const express = require('express');
const router = express.Router();
const nftTemplateController = require('../controllers/nftTemplateController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * /nft-templates:
 *   post:
 *     summary: Create a new NFT template (with image upload)
 *     tags: [NFT Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: NFT template created
 *       400:
 *         description: Missing required fields
 */
/**
 * @swagger
 * /nft-templates:
 *   get:
 *     summary: Get all NFT templates
 *     tags: [NFT Templates]
 *     responses:
 *       200:
 *         description: List of NFT templates
 */
/**
 * @swagger
 * /nft-templates/{id}:
 *   get:
 *     summary: Get NFT template by ID
 *     tags: [NFT Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: NFT template details
 *       404:
 *         description: NFT template not found
 */
/**
 * @swagger
 * /nft-templates/{id}:
 *   put:
 *     summary: Update NFT template by ID
 *     tags: [NFT Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: NFT template updated
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: NFT template not found
 */
/**
 * @swagger
 * /nft-templates/{id}:
 *   delete:
 *     summary: Delete NFT template by ID
 *     tags: [NFT Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: NFT template deleted
 *       404:
 *         description: NFT template not found
 */

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