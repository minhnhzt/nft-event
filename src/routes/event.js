const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - nftTemplate
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               nftTemplate:
 *                 type: string
 *               criteria:
 *                 type: object
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Event created
 *       400:
 *         description: Validation failed
 */
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 */
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 */
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update event by ID
 *     tags: [Events]
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
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated
 */
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete event by ID
 *     tags: [Events]
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
 *         description: Event deleted
 */
/**
 * @swagger
 * /events/{id}/participants:
 *   post:
 *     summary: Add participant to event
 *     tags: [Events]
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
 *             properties:
 *               userid:
 *                 type: string
 *               solanaAddress:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Participant added
 *       400:
 *         description: Missing required fields
 */
/**
 * @swagger
 * /events/{id}/participants/{participantId}:
 *   delete:
 *     summary: Remove participant from event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participant removed
 */
// Tạo sự kiện mới
router.post('/', auth, auth.getUser, eventController.createEvent);
// Lấy danh sách sự kiện
router.get('/', eventController.getEvents);
// Lấy chi tiết sự kiện
router.get('/:id', eventController.getEventById);
// Cập nhật sự kiện
router.put('/:id', auth, auth.getUser, eventController.updateEvent);
// Xóa sự kiện
router.delete('/:id', auth, auth.getUser, eventController.deleteEvent);
// Thêm participant vào event
router.post('/:id/participants', auth, auth.getUser, eventController.addParticipant);
// Xóa participant khỏi event
router.delete('/:id/participants/:participantId', auth, auth.getUser, eventController.removeParticipant);

module.exports = router;