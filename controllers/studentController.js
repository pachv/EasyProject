const studentServive = require('../classes/studentService')

const validator = require('express-validator')

class StudentController {

    async addStudent(req,res,next){
        try {
            
            const errors = validator.validationResult(req)

            if (!errors.isEmpty()){
                return res.status(500).json(errors)
            } else {
                const {name,age,groupId} = req.body

                const studentData = await studentServive.registerStudent(name,age,groupId)
    
                return res.json(studentData)
            }
            
        } catch (e) {
            console.log(e);
            res.status(500).json(e)
        }
    }

    async getAllStudens(req,res,next){
        try {

            const studentsList = await studentServive.getAllStundents()

            return res.json(studentsList)
    
            
        } catch (e) {
            console.log(e);
            res.status(500).json(e)
        }

    }


    async getStudent(req,res,next){

        try {

            const id = req.params.id
        
            const studentWithCurrentId = await studentServive.getStudentById(id)
    
            return res.json(studentWithCurrentId)
            
        } catch (e) {
            console.log(e);
            res.status(500).json(e)
        }


    }
}

module.exports = new StudentController()