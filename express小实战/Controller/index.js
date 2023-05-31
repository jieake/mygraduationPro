const db = require('mysql')
const pool = db.createPool({
  host: '127.0.0.1',
  user: 'root',
  port: 3306,
  password: '',
  database: 'mynode',
  connectionLimit: 10,
})

// 导入密钥
const { keyObj } = require('../config/index.js')
// 导入token包
const jwt = require('jsonwebtoken')
// 签署生成token
const token = jwt.sign({ name: 'wudi' }, keyObj, { expiresIn: '1h' })
// 生成随机验证码并返回
function getCheckCode(req, res) {
  res.send({
    code: 200,
    msg: Math.ceil(Math.random() * (9999 - 1000) + 1000),
  })
}

// 获取管理员信息表
function getAdmins(req, res) {
  const sql = 'select * from admins'
  pool.query(sql, [], (err, data) => {
    if (err) {
      return console.log('管理员查询语句有错' + err)
    }
    res.send(data)
  })
}

// 登录接口
function login(req, res) {
  // // 先校验是否存在有效的token
  // jwt.verify(req.headers.token, keyObj, (err, data) => {
  //   if (err) return
  //   else {
  //     res.send({})
  //   }
  // })
  const { username, password } = req.body
  pool.query('select * from admins where username = ? and password = ?', [username, password], (err, data) => {
    if (err) return console.log('语句有错')
    if (data.length < 1) {
      res.send({
        code: 102,
        msg: '账号密码有误！',
      })
    } else {
      res.send({
        code: 200,
        msg: '登录成功！',
        username,
        userd: data[0].id,
        token,
      })
    }
  })
}

// 校验token是否合法
function verifys(req, res) {
  jwt.verify(req.headers.token, keyObj, (err) => {
    if (err) {
      res.send({ code: 105, msg: 'token校验错误' })
    } else {
      res.send({ code: 200, msg: '成功' })
    }
  })
}

// 修改头像
function changeAvatar(req, res) {
  if (req.file) {
    const avatar = 'upload/' + req.file.filename
    // 创建头像存入数据库语句
    const sql = 'update admins set avatar=? where id = ?'

    pool.query(sql, [avatar, req.body.userd], (err, data) => {
      if (err) {
        return console.log('语句有错误' + err)
      }
    })
    res.send({ code: 200, msg: '图片上传成功' })
  } else {
    res.send({ code: 111, msg: '图片上传失败' })
  }
}

// 校验用户输入的旧密码是否正确
function conparePsw(req, res) {
  // 获取请求体中的密码与用户id
  const oldPsw = req.body.oldPsw
  const userd = req.body.userd
  // 创建查询语句
  const sql = 'select * from admins where id = ?'
  // 获取数据库里存储的密码
  pool.query(sql, [userd], (err, data) => {
    if (err) return console.log('获取数据库密码错误！' + err)
    const sqlPsw = data[0].password
    if (oldPsw === sqlPsw) {
      res.send({ code: 200, msg: '密码正确' })
    } else {
      res.send({ code: 112, msg: '密码错误' })
    }
  })
}

// 修改管理员密码
function editAdmPsw(req, res) {
  // 获取用户传入的新密码
  const userpsw = req.body.userpsw
  console.log(req.body)
  // 获取用户id
  const userd = req.body.userd
  const sql = 'update admins set password = ? where id = ?'
  pool.query(sql, [userpsw, userd], (err, data) => {
    if (err) return console.log('修改密码语句有错' + err)
    res.send({ code: 200, msg: '修改成功' })
  })
}

// 获取头像
function getAvatars(req, res) {
  const id = req.body.id
  const sql = 'select avatar from admins where id = ?'
  pool.query(sql, [id], (err, data) => {
    if (err) {
      return console.log('mysql语句有错')
    }
    res.send({ code: 200, msg: '成功', avatar: 'http://localhost:3000/' + data[0].avatar })
  })
}

// 获取数据库里学生信息表
let n = -1
function getStuMsg(req, res) {
  // 获取每页显示页数
  const pageNum = +req.query.pageNum
  // 获取从第几页开始
  const pageNow = (req.query.pageNow - 1) * pageNum

  n = n + 1
  if (!n) {
    // 先创建一个完整的虚拟表
    console.log(n)
    const sqlclone = 'create view vie_student as select * from student'
    pool.query(sqlclone, [], (err) => {
      if (err) {
        console.log('创建视图错误' + err)
      }
    })
  }
  const sql = `SELECT * FROM vie_student where flag = 1 ORDER BY sid limit ? offset ?`
  pool.query(sql, [pageNum, pageNow], (err, data) => {
    if (err) {
      console.log('视图查询语句有错：' + err)
      return
    }
    res.send(data)
  })
}

// 获取数据分页总数
function getPageSum(req, res) {
  const pNum = +req.query.pageNum
  const sql = 'select count(*) from vie_student where flag = 1'
  pool.query(sql, [], (err, data) => {
    if (err) {
      console.log('查询语句有错')
      return
    }
    res.send({ count: Math.ceil(data[0]['count(*)'] / pNum) })
    // res.send(Math.ceil(data[0]['count(*)'] / pNum))
  })
}

// 删除数据
function dels(req, res) {
  const sid = req.body.sid
  const sql = `update student set flag = 0 where sid = ?`
  pool.query(sql, [sid], (err, data) => {
    if (err) {
      return console.log('删除语句有错')
    } else {
      res.send({ code: 200, msg: '删除成功' })
    }
  })
}

// 修改数据
function editDatas(req, res) {
  const sql = 'update student set sname = ?,sphone = ?,sgender = ?,sage = ?,sscore = ?,clazzid = ? where sid = ?'
  pool.query(sql, [req.body.sname, req.body.sphone, req.body.sgender, req.body.sage, req.body.sscore, req.body.clazzid, req.body.sid], (err, data) => {
    if (err) {
      return console.log('修改语句错误')
    } else {
      res.send({ code: 200, msg: '修改成功' })
    }
  })
}

// 添加数据
function addDatas(req, res) {
  const sql = 'insert into student value(?,?,?,?,?,?,?,?)'
  const [sname, sphone, sgender, sage, sscore, clazzid] = req.body
  pool.query(sql, [null, sname, sphone, sgender, sage, sscore, clazzid, 1], (err, data) => {
    if (err) {
      return console.log('mysql添加语句有误')
    }
    // 受影响行为1表示成功
    if (data.affectedRows === 1) {
      res.send({ code: 200, msg: '添加成功' })
    }
  })
}

// 搜索数据
function searchSt(req, res) {
  const str = req.body.sname
  const sql = "alter view vie_student AS select * from student WHERE sname LIKE CONCAT('%' ,?,'%' )"
  pool.query(sql, [str], (err, data) => {
    if (err) {
      return console.log('搜索视图语句错误')
    } else {
      res.send({ code: 200, msg: '搜索成功' })
    }
  })
}

// 重置搜索数据
function resetMsg(req, res) {
  const sqlclone = 'alter view vie_student as select * from student'
  pool.query(sqlclone, [], (err) => {
    if (err) {
      console.log('重置创建视图错误')
      return
    }
    res.send({ code: 200, msg: '成功' })
    n = 1
  })
}

// 删除虚拟表

// 暴露出去
module.exports = {
  getCheckCode,
  login,
  verifys,
  getStuMsg,
  getPageSum,
  dels,
  editDatas,
  addDatas,
  changeAvatar,
  getAvatars,
  searchSt,
  resetMsg,
  getAdmins,
  conparePsw,
  editAdmPsw,
}
