const router = require('express').Router()
const { getStuMsg, getPageSum, dels, editDatas, addDatas, searchSt, resetMsg } = require('../Controller')

// 三级路由：请求学生数据
router.get('/query', getStuMsg)
// 三级路由: 获取数据分页数
router.get('/getPageS', getPageSum)
// 三级路由: 删除数据
router.delete('/dels', dels)
// 三级路由: 修改数据
router.post('/editData', editDatas)
// 三级路由: 添加数据
router.post('/addData', addDatas)
// 三级路由：搜索学生数据
router.post('/searchStudent', searchSt)
// 三级路由：重置表格显示数据
router.get('/resetMsg', resetMsg)

module.exports = router