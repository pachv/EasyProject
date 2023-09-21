const {Schema,model} = require('mongoose')

const StudentSchema = new Schema({
    name : {type: String, required : true},
    age : {type: Number, required : true},
    groupId : {type: String, required : true},
})

module.exports = model("Students",StudentSchema)