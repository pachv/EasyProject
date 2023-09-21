const StudentModel = require('../models/studentModel')
const StudentDTO = require('../dtos/student')

class StudentService {

    async registerStudent(name,age,groupId){
        const newStudent = await StudentModel.create({name,age,groupId})

        const studentDTO = new StudentDTO(newStudent)

        return {student:studentDTO}
    }

    async getAllStundents() {

        const data = await StudentModel.find();

        return {data}

    }

    async getStudentById(id){
        const student = await StudentModel.findOne({_id:id})

        const studentData = new StudentDTO(student)

        return {student:studentData}
    }
}

module.exports = new StudentService()