// 创建路由实例
const router = require('express').Router()
// 导入token校验包
const jwt = require('jsonwebtoken')
// 导入token校验密钥
const { keyObj } = require('../config/index.js')

// 二级路由，管理员接口
router.use('/admin', require('./admins.js'))

// 二级路由，用户注册接口
router.use('/user', require('./users.js'))

// 导出路由
module.exports = router
