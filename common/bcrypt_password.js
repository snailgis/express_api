const bcrypt = require('bcrypt')

let bcrypt_password = (data) => {
    return new Promise((resolve, reject) => {
        // 加密
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(data, salt, (err, hash) => {
                if (err) { reject(err) }
                resolve(hash)
            })
        })
    })
} 

module.exports = bcrypt_password 