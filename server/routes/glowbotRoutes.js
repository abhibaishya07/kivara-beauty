const express = require('express');
const router = express.Router();
const { consult } = require('../controllers/glowbotController');

router.post('/consult', consult);

module.exports = router;
