const Router = require('express')
const router = new Router()
const orderController =require('../controllers/orderController')

const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', orderController.create)  
router.get('/', checkRole('ADMIN'), orderController.getOrders)
router.get('/userOrders', authMiddleware, orderController.getUserOrders)
router.put('/:id', checkRole('ADMIN'), orderController.updateOrder)
router.delete('/:id', orderController.deleteOrder)

module.exports = router