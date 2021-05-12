const express = require('express')
const router = express.Router()
const User = require('../../models/Users')
const keys = require('../../config/keys')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const passport = require("passport"); // 引入passport验证

const validatorRegisterInput = require("../../validator/register") // 引入register验证方法

router.get("/test", (req, res) => {
    res.json({
        msg: "login works"
    })
    // res.send('login works')
})

// 注册接口
router.post("/register", (req, res) => {
    const { errors, isValid } = validatorRegisterInput(req.body)
    if (!isValid) {
        return res.json(errors)
    } else {
        User.findOne({ email: req.body.email }).then(
            (user) => {
                if (user) {
                    return res.status(400).json({ email: "邮箱已被占用" })
                } else {
                    // var avatar = gravater.url(req.body.email, {s: '200', r: 'pg', d: 'mm'})
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        // avatar,
                        password: req.body.password
                    })
                    // 密码加密
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newUser.password, salt, function (err, hash) {
                            if (err) { throw err }
                            newUser.password = hash;
                            newUser.save().then(user => res.json(user))
                                .catch(err => console.log(err))
                        })
                    })
                }
            }
        )
    }

})


// 登录接口
router.post("/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({ email }).then(
        user => {
            if (!user) {
                return res.json({ email: "不存在该用户" })
            }
            // 密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = {
                            id: user.id,
                            name: user.name
                        }
                        // 用id和name 来做一个token
                        // jwt.sign("规则"， "加密名字"，"过期时间“，箭头函数)
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) {
                                throw err
                            }
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        })
                    } else {
                        return res.json({ password: "密码错误" })
                    }
                })
        }
    )
})

//$route GET api/users/current
//@desc return current user
//@access private
//验证token得到用户信息
//使用passport-jwt验证token

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        password: req.user
    });
})

module.exports = router