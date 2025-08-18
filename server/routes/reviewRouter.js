const Router = require('express')
const router = new Router()
const reviewController = require('../controllers/reviewController')

router.post('/', reviewController.create) 
router.get('/all',  reviewController.getAll)
router.get('/recent', reviewController.get)
router.delete('/:id', reviewController.deleteReview)

module.exports = router