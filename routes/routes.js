const { Router } = require('express');
const router = Router();

const HomeController = require('../controllers/HomeController');
const UserController = require('../controllers/UserController');

router.get('/', HomeController.index);
router.post('/users', UserController.create);

module.exports = router;