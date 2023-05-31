// 创建express服务应用
const express = require('express')
const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http, { cors: true }) //引入跨域参数

// 加载fs包，可以设置文件上传目录
const fs = require('fs')
// 导入操作数据库函数
const { getchatmsg, setchatmsg, addchatmsg } = require('./Controller/index')

// 放开静态资源
app.use(express.static('./assets'))
// 解析json数据格式
bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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
  // 放行
  next()
})

// 注册一级路由(用户接口)
app.use('/api', require('./Router/index.js'))

// 聊天
let hotuser = {} //在线用户id

// 创建通信通道并监听
io.on('connection', (socket) => {
  // 前端socket.emit('login')发送消息，后端socke.on('login')接收
  socket.on('login', (userid) => {
    //注册在线用户
    socket.user = { userId: userid }
    hotuser[socket.id] = userid
    console.log(socket.user?.userId + '上线了')
  })
  // 服务器接收消息并发出
  socket.on('sendMsg', (data) => {
    // 判断接收用户在不在线
    const targetSocketId = Object.keys(hotuser).find((socketId) => hotuser[socketId] === data?.receiverId)
    const userSendId = Object.keys(hotuser).find((socketId) => hotuser[socketId] === data?.sendId)
    // 当用户在线且可以找到已连接socket==>io.sockets?.sockets?.get(targetSocketId)
    if (targetSocketId && io.sockets?.sockets?.has(targetSocketId)) {
      // 存储消息到数据库中
      // 1，首先判断是否存在两人聊天记录
      getchatmsg(data?.receiverId, socket.user.userId).then((res) => {
        if (res.length < 1) {
          // 记录不存在，插入新数据
          setchatmsg(data?.receiverId, socket.user.userId, '')
        }
        // 记录存在，添加记录即可
        addchatmsg(data?.receiverId, socket.user.userId, JSON.stringify({ fromUid: socket.user.userId, msg: data?.msg }))
      })
      // 2，向接收客户端发消息
      io.sockets?.sockets?.get(targetSocketId).emit('fresh-message', { fromUid: socket.user.userId, msg: data?.msg })
      // 3，向发送客户端发送消息
      io.sockets?.sockets?.get(userSendId).emit('fresh-message', { fromUid: socket.user.userId, msg: data?.msg })
    } else {
      // 用户不在线
      console.log(data.receiverId + '不在线')
      // 1，首先判断是否存在两人聊天记录
      getchatmsg(data?.receiverId, socket.user.userId).then((res) => {
        if (res.length < 1) {
          // 记录不存在，插入新数据
          setchatmsg(data?.receiverId, socket.user.userId, '')
        }
        // 记录存在，添加记录即可
        addchatmsg(data?.receiverId, socket.user.userId, JSON.stringify({ fromUid: socket.user.userId, msg: data?.msg }))
      })
      // 3，向发送客户端发送消息
      io.sockets?.sockets?.get(userSendId).emit('fresh-message', { fromUid: socket.user.userId, msg: data?.msg })
    }
  })

  // 客户端下线
  socket.on('disconnect', () => {
    console.log(socket.user?.userId + '下线了')
    delete hotuser[socket.id]
  })
})

// 启动服务
http.listen(3000, () => {
  console.log('启动成功：http://localhost:3000')
})

// 错误中间件
app.use((err, req, res, next) => {
  switch (err) {
    case 105:
      res.send({ code: 105, msg: 'token校验错误' })
      break
    default:
      res.send({ code: 199, msg: '未知错误' })
  }
})
