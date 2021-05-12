const validator = require("validator")
const is_empty = require("./is_empty")

module.exports = function validatorRegisterInput(data){
    let errors = {}
    console.log(data)

    data.name = !is_empty(data.name) ? data.name: ""
    data.email = !is_empty(data.email) ? data.email: ""
    data.password = !is_empty(data.password) ? data.password: ""
    data.password2 = !is_empty(data.password2) ? data.password2: ""

    if(validator.isEmpty(data.name)){
        errors.name = "姓名不能为空"
    }
    if(validator.isEmpty(data.email)){
        errors.email = "邮箱不能为空"
    }
    if(validator.isEmpty(data.password)){
        errors.password = "密码不能为空"
    }
    if(validator.isEmpty(data.password2)){
        errors.password2 = "确认密码不能为空"
    }
    if(!validator.isEmail(data.email)){
        errors.email = "邮箱不合法"
    }
    if(!validator.equals(data.password, data.password2)){
        errors.password2 = "两次密码不一致"
    }
    if(!validator.isLength(data.name, {min:2, max:20})){
        errors.name = "姓名的长度不能小于2位，不能超过20位"
    }
    if(!validator.isLength(data.password, {min:6, max:20})){
        errors.password = "密码的长度不能小于6位，不能超过20位"
    }
    return {
        errors,
        isValid: is_empty(errors)
    }
}