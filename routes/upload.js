const router = require('express').Router()
const uploadImage = require('../middleware/uploadImage')
const uploadCtrl = require('../controllers/uploadCtr')
const auth = require('../middleware/auth')
const authBuilder = require('../middleware/authBuilder')
const authAdmin = require('../middleware/AdminAuth')



router.post('/upload_avatar', uploadImage, auth, uploadCtrl.uploadAvatar)

router.post('/upload_project', uploadImage,authBuilder, uploadCtrl.uploadProjectImage )

router.post('/upload_service', uploadImage, authAdmin, uploadCtrl.uploadService )

router.post('/uploadBuilderLogo', uploadImage, uploadCtrl.uploadBuilderLogo)

module.exports = router