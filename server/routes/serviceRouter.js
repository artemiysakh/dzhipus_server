const Router = require('express')
const router = new Router()
const serviceController = require('../controllers/serviceController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/load', checkRole('ADMIN'), serviceController.loadExcelData)
router.post('/create', checkRole('ADMIN'), serviceController.create)
router.get('/:typeName', serviceController.getAll)

module.exports = router