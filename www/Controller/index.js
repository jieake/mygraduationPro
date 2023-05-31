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

// 导入密钥
const { keyObj } = require('../config/index.js')
// 导入token包
const jwt = require('jsonwebtoken')
// 签署生成token
function getToken(data) {
  return jwt.sign(data, keyObj, { expiresIn: '24h' })
}

// 1，生成随机验证码并返回
function getCheckCode(req, res) {
  res.send({
    code: 201,
    data: Math.ceil(Math.random() * (999999 - 100000) + 100000),
    msg: '获取验证码成功！',
  })
}

// 查询数据库中是否有相同的昵称
function getUserData(uname) {
  // 判断是否有重名数据
  let sql = 'select * from student where susername = ?'
  return new Promise((resolve) => {
    pool.query(sql, [uname], (err, data) => {
      if (err) return console.log('查询重名有err', err)
      if (data.length > 0) {
        // 有重名
        resolve(true)
      } else {
        // 没有重名
        resolve(false)
      }
    })
  })
}

// 2，用户注册
function signUp(req, res) {
  let { susername, spassword, semail, school } = req.body
  // 查询该昵称是否被占用了
  getUserData(susername).then((result) => {
    if (result) {
      // 昵称存在
      res.send({ code: 103, msg: '该昵称已存在' })
      return
    }
    // 昵称不存在，可以注册
    let sql = 'INSERT INTO student set susername=?,spassword=?,semail=?,school=?;'
    pool.query(sql, [susername, spassword, semail, school], (err, data) => {
      if (err) return console.log('err', err)
      if (data) {
        res.send({ code: 200, msg: '注册成功！' })
        // 初始化朋友信息表
        let sql1 = 'insert into sfriends set id = ?'
        pool.query(sql1, [data.insertId], (err, data) => {
          if (err) return console.log('2===用户注册初始化表err', err)
        })
      }
    })
  })
}

// 3，用户登录并返回token
function signIn(req, res) {
  let { susername, spassword } = req.body
  let sql = 'select * from student where susername = ? and spassword = ?'
  pool.query(sql, [susername, spassword], (err, data) => {
    if (err) return console.log('用户登录sql语句有错', err)
    if (data.length > 0) {
      res.send({ code: 200, msg: '登录成功！', token: getToken({ uname: susername }), data: { susername, school: data[0].school, uid: data[0].sid } })
    } else {
      res.send({ code: 106, msg: '用户不存在！' })
    }
  })
}

// 4，获取动态列表
function getactive(req, res) {
  let sql = 'select stfresh.*,student.savatar from stfresh left join student on stfresh.sfreshauthorid = student.sid'
  pool.query(sql, [], (err, data) => {
    if (err) return console.log('获取动态列表sql错误', err)
    res.send({ code: 201, msg: '获取动态列表成功！', data })
  })
}

// 5，获取好友数据
function getfriendsList(req, res) {
  let sql = 'select * from sfriends where id = ?'
  let { id } = req.body
  pool.query(sql, [id], (err, data) => {
    if (err) return console.log('获取好友列表数据sql错误', err)

    res.send({ code: 201, msg: '获取数据成功！', data })
  })
}

// 获取聊天数据
function getchatmsg(idone, idtwo) {
  let sql = 'select * from schatmsg where (joinidone = ? and joinidtwo = ?) or (joinidone = ? and joinidtwo = ?)'
  return new Promise((resolve) => {
    pool.query(sql, [idone, idtwo, idtwo, idone], (err, data) => {
      if (err) return console.log('获取聊天数据sql语句有错', err)
      resolve(data)
    })
  })
}

// 初始化时插入聊天数据
function setchatmsg(idone, idtwo, msg = '') {
  let sql = 'INSERT INTO schatmsg set joinidone = ?,joinidtwo = ?,messages=?,msgtime =null'
  pool.query(sql, [idone, idtwo, msg], (err, data) => {
    if (err) return console.log('插入聊天数据sql语句有错', err)
  })
}

// 后续添加聊天记录
function addchatmsg(idone, idtwo, msg = '') {
  let sql = 'update schatmsg set joinidone=?,joinidtwo=?,messages=CONCAT(messages,?,";") where (joinidone = ? and joinidtwo = ?) or (joinidone = ? and joinidtwo = ?);'
  pool.query(sql, [idone, idtwo, msg, idone, idtwo, idtwo, idone], (err, data) => {
    if (err) return console.log('添加聊天记录sql错误', err)
  })
}

// 6，进入聊天界面获取聊天数据
function getchatList(req, res) {
  let { idone, idtwo } = req.body
  getchatmsg(idone, idtwo).then((result) => {
    res.send({ code: 201, data: result })
  })
}

// 7，获取用户好友列表数据
function getuserfriends(req, res) {
  let { uid } = req.body
  let sql = 'select * from sfriends where id = ?'
  pool.query(sql, [uid], (err, data) => {
    if (err) return console.log('7sql语句错误', err)
    res.send({ code: 201, msg: '获取首页用户好友信息成功！', data })
  })
}

// 8，发送好友请求
function requirefriend(req, res) {
  let { fromid, getid, uname } = req.body
  // 判断好友请求是否已经存在
  judgeFriends(fromid, getid).then((result) => {
    if (result) {
      // 请求存在时，把状态改为-1
      let sql = 'update srequestfriends set requestflag = ? where senduserid = ? and getuserid = ?'
      pool.query(sql, [-1, fromid, getid], (err, data) => {
        if (err) return console.log('11===sql语句错误', err)
      })
      res.send({ code: 202, msg: '请求已经存在！' })
    } else {
      // 好友请求不存在
      let sql = 'INSERT INTO srequestfriends set senduserid=?,sendusername=?,getuserid=?,requesttime=null'
      pool.query(sql, [fromid, uname, getid], (err, data) => {
        if (err) return console.log('8好友请求sql', err)
        res.send({ code: 201, msg: '发送成功', data })
      })
    }
  })
}

// 9，判断好友请求是否已经存在
function judgeFriends(sid, gid) {
  return new Promise((resolve) => {
    let sql = 'select * from srequestfriends where senduserid = ? and getuserid = ?'
    pool.query(sql, [sid, gid], (err, data) => {
      if (data.length > 0) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

// 10，获取好友请求列表
function getrequireFriends(req, res) {
  let { getid } = req.body
  let sql = 'select * from srequestfriends where getuserid = ?'
  pool.query(sql, [getid], (err, data) => {
    if (err) return console.log('10==sql错误', err)
    res.send({ code: 201, msg: '获取好友请求列表成功！', data })
  })
}

// 11，好友申请状态 0拒绝 1接收
function getrequirefriendsstatus(req, res) {
  let { sid, gid, sflag, gname, sname } = req.body
  let sql = 'update srequestfriends set requestflag = ? where senduserid = ? and getuserid = ?'
  pool.query(sql, [sflag, sid, gid], (err, data) => {
    if (err) return console.log('11===sql语句错误', err)
    res.send({ code: 201, msg: '修改状态成功！', data })
  })
  // 插入好友表中
  if (sflag === 1) {
    let sql = 'update sfriends set userid=CONCAT(userid,?,";"),friendsname=CONCAT(friendsname,?,";") where id = ?'
    pool.query(sql, [sid, gname, gid], (err, data) => {
      if (err) return console.log('11===插入好友表中sql错误', err)
    })
    pool.query(sql, [gid, sname, sid], (err, data) => {
      if (err) return console.log('11===插入好友表中sql错误', err)
    })
  }
}

// 12，获取请求数据表信息
function getRequireMsg(req, res) {
  let { id } = req.body
  let sql = 'select * from srequestfriends where senduserid = ? or getuserid = ?'
  pool.query(sql, [id, id], (err, data) => {
    if (err) return console.log('12===sql语句错误', err)
    res.send({ code: 201, msg: '请求数据成功！', data })
  })
}

// 13，获取某一条动态数据
function getSomeActive(req, res) {
  let { stfreshid } = req.body
  let sql = 'select stfresh.*,student.savatar from stfresh left join student on stfresh.sfreshauthorid = student.sid where stfreshid = ?'
  pool.query(sql, [stfreshid], (err, data) => {
    if (err) return console.log('13===sql语句错误')
    res.send({ code: 201, msg: '获取数据成功！', data })
  })
}

// 14，添加对动态的评论
function addComment(req, res) {
  let { stfreshid, commentauthor, commentaid, commentmsg } = req.body
  let sql = 'insert into stfreshcomment set stfreshid=?,commentauthor=?,commentaid=?,commenttime=null,commentmsg=?'
  pool.query(sql, [stfreshid, commentauthor, commentaid, commentmsg], (err, data) => {
    if (err) return console.log('14===sql错误', err)
    res.send({ code: 201, msg: '添加评论成功！' })
  })
}

// 15，获取某个动态的评论
function getComments(req, res) {
  let { stfreshid } = req.body
  let sql = 'select * from stfreshcomment where stfreshid = ?'
  pool.query(sql, [stfreshid], (err, data) => {
    if (err) return console.log('15===sql错误', err)
    res.send({ code: 201, msg: '获取评论数据成功！', data })
  })
}

// 16，更新动态数据里的评论和收藏
function updateFresh(req, res) {
  // 0是更新收藏，1是更新评论
  let { tag, stfreshid, freshstarid, freshstarname } = req.body
  let sql = ''
  if (tag === 1) {
    // 更新评论
    sql = 'update stfresh set scommendnum=scommendnum+1 where stfreshid = ?'
    pool.query(sql, [stfreshid], (err, data) => {
      if (err) return console.log('16===sql错误', err)
      res.send({ code: 201, msg: '成功！' })
    })
  } else {
    // 更新收藏
    sql = 'update stfresh set sfreshCollect=sfreshCollect+1 where stfreshid = ?'
    pool.query(sql, [stfreshid], (err, data) => {
      if (err) return console.log('16===sql错误', err)
    })
    console.log(req.body)
    // 插入收藏者数据
    let sql1 = 'insert into freshstar set stfreshid = ?,freshstarid=concat(freshstarid,?),freshstarname=concat(freshstarname,?)'
    pool.query(sql1, [stfreshid, freshstarid, freshstarname], (err, data) => {
      if (err) return console.log('16====插入收藏者数据sql错误')
      console.log(data)
      res.send({ code: 201, msg: '收藏成功！' })
    })
  }
}

// 17，获取动态收藏者列表
function getStarList(req, res) {
  let { stfreshid } = req.body
  let sql = 'select * from freshstar where stfreshid = ?'
  pool.query(sql, [stfreshid], (err, data) => {
    if (err) return console.log('17===获取动态收藏者sql错误', err)
    res.send({ code: 201, msg: '获取收藏者成功', data })
  })
}

// 18，获取用户列表
function getUsers(req, res) {
  let sql = 'SELECT * FROM student ORDER BY RAND() LIMIT 10;'
  pool.query(sql, [], (err, data) => {
    if (err) return console.log('18===sql语句错误' + err)
    res.send({ code: 201, msg: '获取用户列表成功', data })
  })
}

// 19，搜索用户
function getSomeone(req, res) {
  let { uname } = req.body
  let mz = '%' + uname + '%'
  let sql = 'SELECT * FROM student where susername like ?'
  pool.query(sql, [mz], (err, data) => {
    if (err) return console.log('18===sql语句错误' + err)
    res.send({ code: 201, msg: '获取用户成功', data })
  })
}

// 20，获取用户个人信息
function getUserInfos(req, res) {
  let { sid } = req.body
  let sql = 'select * from student where sid = ?'
  let sql1 = 'select * from stfresh where sfreshauthorid = ?'
  pool.query(sql, [sid], (err, data1) => {
    if (err) return
    // 21，获取某个用户动态
    pool.query(sql1, [sid], (err, data2) => {
      if (err) return
      res.send({ code: 201, meg: '获取数据成功！', data: { info: data1, actives: data2 } })
    })
  })
}

// 21，修改个人信息
function setUserInfo(req, res) {
  console.log(req.body, 1111)
  let { sflag, sid, susername, spassword, sgender, sphone, semail, savatar, studentnum, struename, sintroduction } = req.body
  let sql
  switch (sflag) {
    case 1:
      sql = 'update student set susername=?, spassword=?,semail = ? where sid=?'
      pool.query(sql, [susername, spassword, semail, sid], (err, data) => {
        if (err) return
        res.send({ code: 200, msg: '修改成功！', data })
      })
      break
    case 2:
      sql = 'update student set sgender=?, sphone=?,studentnum = ?,struename = ? where sid=?'
      pool.query(sql, [sgender, sphone, studentnum, struename, sid], (err, data) => {
        if (err) return
        res.send({ code: 200, msg: '修改成功！', data })
      })
      break

    case 4:
      sql = 'update student set sintroduction=? where sid=?'
      pool.query(sql, [sintroduction, sid], (err, data) => {
        if (err) return
        res.send({ code: 200, msg: '修改成功！', data })
      })
      break
  }
}

// 22，获取所有用户
function getAdminUsers(req, res) {
  let sql = 'SELECT * FROM student '
  pool.query(sql, [], (err, data) => {
    if (err) return console.log('18===sql语句错误' + err)
    res.send({ code: 201, msg: '获取用户列表成功', data })
  })
}

module.exports = {
  getCheckCode,
  signUp,
  signIn,
  getactive,
  getfriendsList,
  getchatmsg,
  setchatmsg,
  addchatmsg,
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
  getAdminUsers,
}
