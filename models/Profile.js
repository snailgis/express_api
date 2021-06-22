//建立数据库表格式
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
//create Schema
const ProfileSchema = new Schema({
    type:{
        type:String
    },
    describe:{
        type:String
    },
    income:{
        type:String,
        required:true
    },
    expend:{
        type:String,
        required:true
    },
    cash:{
        type:String,
        required: true
    },
    remark:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
})
 
module.exports = Profiles = mongoose.model("profile",ProfileSchema);