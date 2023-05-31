const { getAdminUsers } = require('../Controller')

// 创建路由实例
const router = require('express').Router()

router.get('/getuserinfo', getAdminUsers)

module.exports = router
