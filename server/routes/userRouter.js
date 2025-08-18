const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const {body} = require('express-validator')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/registration', 
        body('email').isEmail(),
        body('password').isLength({min:5, max:32}),
        userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', checkRole('ADMIN'), userController.getUsers)
router.post('/users/makeAdmin', checkRole('ADMIN'), userController.makeAdmin)
router.get('/checkAdmin', checkRole('ADMIN'), (req, res) => {res.json({ isAdmin: true });});
router.post('/forgot-password', 
    body('email').isEmail(),
    userController.forgotPassword);
router.post('/reset-password',
    body('resetToken').notEmpty(),
    body('newPassword').isLength({min:5, max:32}),
    userController.resetPassword);
router.post('/users/resend-activation', authMiddleware, userController.resendActivation);

module.exports = router