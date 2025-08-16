// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser } = require('../controllers/userController');

// router.post('/', registerUser);
// router.post('/login', loginUser);

// module.exports = router;

// console.log('--- Loading userRoutes.js ---');
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
// console.log('--- All modules loaded in userRoutes.js ---');


router.post('/', registerUser);
router.post('/login', loginUser);

module.exports = router;