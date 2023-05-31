const express = require('express')
// 加载解决跨域包cors
const cors = require('cors')
// 加载fs包，可以设置文件上传目录
const fs = require('fs')

const app = express()

// 解析Json
bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 使用cors解决跨域
app.use(cors())
// 托管静态管理资源
// app.use(express.static('./Public'))
// 设置登录页为默认进入页
app.use(express.static(__dirname + '/public', { index: 'login.html' }))

// 全局中间件
app.use((req, res, next) => {
  //获取前端请求过来的IP地址
  let ip = (req.headers['x-real-ip'] || req.connection.remoteAddress).slice(7)
  // 请求ip写入文件
  fs.appendFile('./info.txt', `${ip}========${req.url}=======${new Date().toLocaleString()}\n`, (err, data) => {
    if (err) return
  })
  //解决中文乱码
  res.setHeader('content-Type', 'text/plain;charset=UTF-8')
  // if (ip) {
  //   // 全给拦截
  //   res.send({ code: 501, msg: '禁止访问' })
  //   return
  // }
  // 放行
  next()
})

// 注册一级路由(管理后台)
app.use('/admin', require('./Router/index.js'))

// 错误中间件
app.use((err, req, res, next) => {
  switch (err) {
    case 105:
      res.send({ code: 105, msg: 'token校验错误' })
      break
    default:
      res.send({ code: 199, msg: '未知错误' })
  }
  next()
})

app.listen(3003, () => {
  console.log('启动成功！http://localhost:3003/login.html')
})
