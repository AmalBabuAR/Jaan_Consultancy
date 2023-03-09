const router = require('express').Router()
const adminCtrl = require('../controllers/adminController')
const adminAuth = require('../middleware/AdminAuth')

router.post('/register', adminCtrl.register)

router.post('/login', adminCtrl.login)

router.use(adminAuth)

router.get('/approval', adminCtrl.approval)

router.patch('/approval/accept', adminCtrl.approvalAccept)

router.get('/serviceDetails', adminCtrl.getServiceDetails)




module.exports = router