const Router = require('express').Router
const studentController = require('../controllers/studentController')

const validatorMiddleware = require('express-validator')




const router = new Router()

router.post('/add-student',
    [
    validatorMiddleware.check('age','age must be between 12 and 99').isInt({min:12,max:99}),
    validatorMiddleware.check('name','name must be 4 symbols or more').isLength({ min: 4 }),
    validatorMiddleware.check('groupId','groupId must be 4 symbols or more').isLength({ min: 4 }),
    ],
    studentController.addStudent)
router.get('/get-students',studentController.getAllStudens)
router.get('/get-student/:id',studentController.getStudent)

module.exports = router