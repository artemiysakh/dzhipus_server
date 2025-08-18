const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const serviceRouter = require('./serviceRouter')
const typeRouter = require('./typeRouter')
const orderRouter = require('./orderRouter')
const reviewRouter = require('./reviewRouter')
const feedbackRouter = require('./feedbackRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/service', serviceRouter)
router.use('/order', orderRouter)
router.use('/review', reviewRouter)
router.use('/feedback', feedbackRouter)

module.exports = router