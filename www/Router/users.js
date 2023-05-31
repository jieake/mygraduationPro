// 使用mysql数据库包连接数据库
const db = require('mysql')
const pool = db.createPool({
  host: '127.0.0.1',
  user: 'root',
  port: 3306,
  password: '',
  database: 'schoolsocial',
  connectionLimit: 10,
  charset: 'utf8mb4',
})

// 创建路由实例
const router = require('express').Router()
const {
  getCheckCode,
  signUp,
  signIn,
  getactive,
  getfriendsList,
  getchatList,
  getuserfriends,
  requirefriend,
  judgeFriends,
  getrequireFriends,
  getrequirefriendsstatus,
  getRequireMsg,
  getSomeActive,
  addComment,
  getComments,
  updateFresh,
  getStarList,
  getUsers,
  getSomeone,
  getUserInfos,
  setUserInfo,
} = require('../Controller/index.js')
// 导入token校验包
const jwt = require('jsonwebtoken')
// 导入token校验密钥
const { keyObj } = require('../config/index')
// 唯一标识码uuid
const { v4: uuidv4 } = require('uuid')

// 引入文件接收包multer
const multer = require('multer')
// 存储动态上传文件保存路径
let imgarr = []
// 存储头像上传文件保存路径
let imgavatar = ''

const storage = (savaPath = 'user') =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `assets/${savaPath}/`)
    },
    filename: function (req, file, cb) {
      // fieldname是表单的name值，也就是我们设定的“logo”，
      // originalname是文件上传时的名字，可以根据它获取后缀，
      // encoding，mimetype 我就不详细介绍了，可以自行输出查看。

      const { originalname } = file
      let imgname = uuidv4() + '.' + originalname.split('.')[1]
      if (savaPath === 'user') {
        imgarr.push(`http://localhost:3000/${savaPath}/` + imgname)
      } else {
        imgavatar = `http://localhost:3000/${savaPath}/` + imgname
        console.log(imgavatar)
      }

      cb(null, imgname)
    },
  })
// uploads是保存动态图片的
const uploads = multer({
  storage: storage(),
})
// fnAvatar是保存用户头像的
const fnAvatar = multer({
  storage: storage('useravatar'),
})

// 三级路由：获取验证码
router.get('/getCheckCode', getCheckCode)
// 三级路由：用户注册
router.post('/signUp', signUp)

// 三级路由：用户登录
router.post('/signIn', signIn)

// 路由中间件：拦截验证，校验token
router.use((req, res, next) => {
  // 获取头部headers的token
  const token = req.headers.token
  // 校验token是否正确
  jwt.verify(token, keyObj, (err) => {
    if (err) {
      next(105)
    } else {
      next()
    }
  })
})

// 三级路由：获取动态列表
router.get('/getactive', getactive)

// 三级路由：发布动态中间件
router.post('/publish', uploads.array('actImg', 9), (req, res) => {
  //  数据解构
  let { sfreshauthor, sfreshcontent, sfreshauthorid } = JSON.parse(req.body.activedata)
  // 存储动态到数据库
  let sql = 'INSERT INTO stfresh set sfreshauthor=?,sfreshcontent=?,sfreshauthorid=?,sfreshtime=?,sfreshimglist=?'
  pool.query(sql, [sfreshauthor, sfreshcontent?.txt, sfreshauthorid, null, JSON.stringify(imgarr)], (err, data) => {
    if (err) return console.log('发布动态sql出错！', err)
    res.send({ code: 200, msg: '动态发布成功！' })
  })
  // 还原数组
  imgarr.length = 0
})

// 三级路由：获取用户好友列表
router.post('/getfriendsList', getfriendsList)

// 三级路由：获取聊天信息
router.post('/getchatmsg', getchatList)

// 三级路由：获取用户好友列表数据
router.post('/getuserfriends', getuserfriends)

// 三级路由：发送好友请求
router.post('/requirefriend', requirefriend)

// 三级路由：判断好友请求是否已经存在
router.post('/judgefriend', judgeFriends)

// 三级路由：获取用户好友列表
router.post('/getrequireFriends', getrequireFriends)

// 三级路由：获取用户好友申请状态
router.post('/getrequirefriendsstatus', getrequirefriendsstatus)

// 三级路由：获取用户好友请求数据
router.post('/getrequiremsg', getRequireMsg)

// 三级路由：获取某个动态数据
router.post('/getSomeActive', getSomeActive)

// 三级路由：添加动态评论
router.post('/addcomment', addComment)

// 三级路由：获取某个动态的评论
router.post('/getcomments', getComments)

// 三级路由：更新动态数据（评论和收藏）
router.post('/updatefresh', updateFresh)

// 三级路由：获取收藏者数据列表
router.post('/getstarlist', getStarList)

// 三级路由：获取用户数据
router.get('/getUsers', getUsers)

// 三级路由：搜索某个用户
router.post('/getsomeone', getSomeone)

// 三级路由：获取某个用户信息
router.post('/getuserinfo', getUserInfos)

// 三级路由：设置用户信息
router.post('/setuserinfo', setUserInfo)

// 三级路由：设置头像
router.post('/setavatar', fnAvatar.single('avatar'), (req, res) => {
  console.log(req.file)
  let { sid } = JSON.parse(req.body.userinfo)
  sql = 'update student set savatar=? where sid=?'
  pool.query(sql, [imgavatar, sid], (err, data) => {
    if (err) return
    res.send({ code: 200, msg: '头像修改成功！', data })
  })
})

// 导出路由
module.exports = router
