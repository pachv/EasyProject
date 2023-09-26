const Router = require('express').Router
const userController = require('../controllers/userController')

const router = new Router()

const validator = require('express-validator')

router.post('/registrate',
    validator.body('email').isEmail(),
    validator.body('password').isLength({min:1,max:20}),
    userController.registration)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.get('/refresh',userController.refresh)

module.exports = router