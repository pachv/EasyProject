module.exports = class StudentDTO {
    name
    age
    groupId
    id

    constructor(model){
        this.id = model._id
        this.name = model.name
        this.age = model.age
        this.groupId = model.groupId
    }
}