const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.getRegisterPage);
router.get('/login', authController.getLoginPage);
router.post('/register', authController.register);
router.post('/loginUser', authController.login);

module.exports = router;