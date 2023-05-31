import axios from './index.js'

// 接收验证码数据
export function getCheckCode() {
  return axios.get('/user/getCheckCode')
}
// 用户注册
export function userSign(data) {
  return axios.post('/user/signUp', data)
}
// 用户登录
export function userlogin(data) {
  return axios.post('/user/signIn', data)
}

// 发布动态
export function userPublish(data) {
  return axios.post('/user/publish', data)
}

// 动态列表获取
export function userGetActive() {
  return axios.get('/user/getactive')
}

// 好友列表获取
export function userfriendsList(data) {
  return axios.post('/user/getfriendsList', data)
}

// 获取好友消息
export function getchatmsg(data) {
  return axios.post('/user/getchatmsg', data)
}

// 获取用户首页好友信息
export function userHasFriends(data) {
  return axios.post('/user/getuserfriends', data)
}

// 发送好友请求
export function sendrequirefriend(data) {
  return axios.post('/user/requirefriend', data)
}

// 获取用户好友请求列表
export function getrequirefriends(data) {
  return axios.post('/user/getrequireFriends', data)
}

// 获取用户好友请求状态
export function getRequireStatus(data) {
  return axios.post('/user/getrequirefriendsstatus', data)
}

// 获取请求列表信息
export function getrequiremsg(data) {
  return axios.post('/user/getRequireMsg', data)
}

// 请求某一动态数据
export function getsomeactive(data) {
  return axios.post('/user/getSomeActive', data)
}

// 给动态添加评论
export function sendAxiosComment(data) {
  return axios.post('/user/addcomment', data)
}

// 获取动态评论数据
export function getAxioComments(data) {
  return axios.post('/user/getcomments', data)
}

// 获取动态评论数据
export function updateAxiosFresh(data) {
  return axios.post('/user/updatefresh', data)
}

// 获取动态收藏者列表
export function getAxiosStar(data) {
  return axios.post('/user/getstarlist', data)
}

// 获取网站用户列表
export function getAxiosUser() {
  return axios.get('/user/getUsers')
}

// 搜索用户
export function getAxiosOne(data) {
  return axios.post('/user/getsomeone', data)
}

// 获取用户信息
export function getAxiosUserinfo(data) {
  return axios.post('/user/getuserinfo', data)
}

// 修改用户信息
export function setAxiosUserinfo(data) {
  return axios.post('/user/setuserinfo', data)
}

// 修改用户信息
export function setAxiosAvatars(data) {
  return axios.post('/user/setavatar', data)
}

// 管理员获取用户信息
export function getAxiosAdminUserInfo() {
  return axios.get('/admin/getuserinfo')
}
