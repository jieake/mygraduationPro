const router = require('express').Router()
// 导入token校验包
const jwt = require('jsonwebtoken')
// 导入token校验密钥
const { keyObj } = require('../config/index.js')

// 二级路由，管理员接口
router.use('/admin', require('./next.js'))


// 拦截验证，校验token
router.use((req, res, next) => {
  // 获取头部headers的token
  const token = req.headers.token
  // 校验token是否正确
  jwt.verify(token, keyObj, (err, data) => {
    if (err) {
      next(105)
    } else {
      next()
    }
  })
})

// 二级路由，学生信息管理接口
router.use('/student', require('./student.js'))
module.exports = router