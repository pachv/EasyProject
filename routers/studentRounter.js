const Router = require('express').Router
const studentController = require('../controllers/studentController')

const validatorMiddleware = require('express-validator')

// middleware to check if user is authorized
const isUserAuthorized = require('../middleware/authUserMiddleware')



const router = new Router()

router.post('/add-student',
    isUserAuthorized,
    [
    validatorMiddleware.check('age','age must be between 12 and 99').isInt({min:12,max:99}),
    validatorMiddleware.check('name','name must be 4 symbols or more').isLength({ min: 4 }),
    validatorMiddleware.check('groupId','groupId must be 4 symbols or more').isLength({ min: 4 }),
    ],
    studentController.addStudent)
router.get('/get-students',
    isUserAuthorized
    ,studentController.getAllStudens)
router.get('/get-student/:id',
    isUserAuthorized
    ,studentController.getStudent)

module.exports = router