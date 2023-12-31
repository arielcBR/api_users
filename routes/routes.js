const { Router } = require('express');
const router = Router();

const HomeController = require('../controllers/HomeController');
const UserController = require('../controllers/UserController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', HomeController.index);
router.post('/users', UserController.create);
router.get('/users', adminAuth, UserController.findAll);
router.get('/users/:id', UserController.findUser);
router.put('/users', UserController.edit);
router.delete('/users/:id', UserController.delete);
router.post('/users/recoverypassword', UserController.recoveryPassword);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);

module.exports = router;