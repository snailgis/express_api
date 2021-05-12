# express_api
基于nodejs中express Web应用程序框架搭建接口

### nodejs接口搭建
##### （一）使用express搭建服务器

```javascript
const express = require('express')
const app = express()

// 设置端口
const server = app.listen(4000, () => {
    const port = server.address().port
    console.log('监听接口地址 at http://localhost:%s', port)
})

// 设置路由,测试路由
app.get('/hello', (req, res) => {
    res.send('Hello World')
})
```

##### （二）Node-连接MongoDB数据库
```javascript
const mongoose = require('mongoose')

const mlabURI = "mongodb+srv://test:woniu123@vuewebgis.udsts.mongodb.net/vue_webgis?retryWrites=true&w=majority"
// 连接数据库
// { useNewUrlParser: true, useUnifiedTopology: true }这两个参数用于忽略任务台警告
mongoose.connect(mlabURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("mongodb连接成功")
}).catch((err) => {
    console.log(err)
})
```
##### （三）Node-搭建路由和数据模型
```javascript
/* 搭建路由 */
// 1.创建/routers/apis/users.js
// 2.引入express router
const express = require('express')
const router = express.Router()

module.exports = router

// 3. 在入口文件中引入router文件
const users = require('./routers/api/users')
// 使用routes
app.use('/api/users', users)

// 在users.js接口模块中测试get接口
router.get("/test", (req, res) => {
    res.json({
        msg: "login works"
    })
    // res.send('login works')
})
```

```javascript
/* 创建数据模型 */
// 1. 创建models/User.js
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    data: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model("users", UserSchema)
```

##### （四）Node-搭建注册接口并存储数据
> body-parser中间件的使用，用于对post接口的请求体进行解析
> [Nodejs 进阶：Express 常用中间件 body-parser 实现解析](https://www.cnblogs.com/chyingp/p/nodejs-learning-express-body-parser.html)

> bcrypt中间件：主要对密码进行加密和解密

```javascript
// 1. 在/routers/apis/users.js接口模块中创建post注册接口
// 引入数据模型
const User = require('../../models/Users')
// 2. 搭建post接口需要安装body-parser组件，在入口文件index.js中初始化body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
// 3. 密码一般为暗码存储，引入bcrypt进行密码加密和密码匹配
const bcrypt = require('bcrypt')

// 4. 注册接口搭建
// $route POST api/users/register
// @desc 返回user
// @access public
// 注册
router.post("/register", (req, res) => {
    User.findOne({ email: req.body.email }).then(
        (user) => {
            if(user){
                return res.status(400).json({ email: "邮箱已被占用" })
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                // 密码加密
                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(newUser.password, salt, function(err, hash){
                        if(err){ throw err}
                        newUser.password = hash;
                        newUser.save().then(user => res.json(user))
                        .catch(err => console.log(err))
                    })
                })
            }
        }
    )
})
```
##### （五）Node-搭建登录接口

```javascript
// $route POST api/users/login
// @desc 返回token jwt passport
// @access public
// 登录
router.post("/login",(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    //查询数据库
    User.findOne({email})
        .then(user =>{
            if(!user){
                return res.json({email:"用户不存在"});  //return res.status(404).json({email:"用户不存在"});
            }
            //密码匹配  使用token
            bcrypt.compare(password,user.password)
                .then(isMatch=>{
                    if(isMatch){
                        res.json({msg:"success"});
                    }else{
                        return res.json({password:"密码错误!"});  //return res.status(400).json({password:"密码错误!"});
                    }
                })
            })
        })
```

##### （六）Node-使用jwt实现token
> jsonwebtoken中间件，我们登录完成后，返回{msg: "success"},而实际上，当我们完成系统登录后，会返回一个token，这里通过jsonwebtoken来实现

```javascript
// 登录接口
router.post("/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email }).then(
        user => {
            if(!user){
                return res.json({ email: "不存在该用户"})
            }
            // 密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const rule = {
                            id: user.id,
                            name: user.name
                        }
                        // 用id和name 来作为规则生成一个token
                        // jwt.sign("规则"， "加密名字"，"过期时间“，箭头函数)
                        jwt.sign(rule, "secret", { expiresIn: 3600}, (err, token) => {
                            if(err) {
                                throw err
                            }
                            res.json({
                                success: true,
                                token: 'rl ' + token
                            })
                        })
                    } else {
                        return res.json({ password: "密码错误"})
                    }
                })
        }
    )
})
```

##### （七）Node-使用passport-jwt验证token
> 使用passport-jwt和passport中间件来验证token，
> 
> passport-jwt是一个针对jsonwebtoken的插件，passport是express框架的一个针对密码的中间件


