module.exports = class UserDTO {
    email
    id

    constructor(model){
        this.email = model.email
        this.id = model._id
    }
}