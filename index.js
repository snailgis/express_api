const express = require('express')
const mongoose = require('mongoose')
const db = require('./config/keys')

const users = require('./routers/api/users')

const bodyParser = require('body-parser')
const passport = require("passport");       //引入passport插件

const app = express()

// 设置路由,测试路由
app.get('/hello', (req, res) => {
    res.send('Hello World')
})

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


app.use(passport.initialize()); 
require("./config/passport")(passport); // 引入passport.js文件

// 设置端口
const server = app.listen(4000, () => {
    const port = server.address().port
    console.log('监听接口地址 at http://localhost:%s', port)
})

// 连接数据库
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("mongodb连接成功")
}).catch((err) => {
    console.log(err)
})

// 使用routes
app.use('/api/users', users)