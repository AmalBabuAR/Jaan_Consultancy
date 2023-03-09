const router = require('express').Router()
const builderCtrl = require('../controllers/builderController')
const builderAuth = require('../middleware/authBuilder') 


router.post('/phnVer', builderCtrl.phoneVer)

router.post('/verEmailAndPassword', builderCtrl.verEmailAndPassword)

router.get('/getServiceCategory', builderCtrl.getServiceCategory)

router.post('/register', builderCtrl.register)

router.post('/login', builderCtrl.login)

router.post('/', builderCtrl.login)
router.get('/registerInfo/:id', builderCtrl.registerInfo)
router.use(builderAuth)
router.get('/projectView', builderCtrl.getProjectImage)

router.post('/project', ((req,res) => {
    console.log('came her');
}))






module.exports = router