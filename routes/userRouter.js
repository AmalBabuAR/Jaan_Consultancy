const router = require('express').Router()
const userCtrl = require('../controllers/userController')
const auth  = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/register', userCtrl.register)

router.post('/activation', userCtrl.activateEmail)

router.post('/login', userCtrl.login)

router.post('/refresh_token', userCtrl.getAccessToken)

router.post('/forgot', userCtrl.forgotPassword)

router.post('/reset', auth, userCtrl.resetPassword)

router.get('/services', userCtrl.getServices)

router.get('/logout', userCtrl.logout)
router.use(auth)

router.get('/getBuilder/:category', userCtrl.getBuilderDetails)

router.get('/projectView/:id', userCtrl.getProjectImage)






router.get('/infor', auth, userCtrl.getUserInfor)

router.get('/all_infor', auth, authAdmin, userCtrl.getUsersAllInfor)


router.patch('/update', auth, userCtrl.updateUser)

router.patch('/update_role/:id', auth, authAdmin, userCtrl.updateUsersRole)

router.delete('/delete/:id', auth, authAdmin, userCtrl.deleteUser)


module.exports = router
