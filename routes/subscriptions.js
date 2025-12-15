const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');


router.post('/', subscriptionController.createSubscription);
router.get('/:id', subscriptionController.getSubscription);


module.exports = router;