const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middlewares/auth');

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