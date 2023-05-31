import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
import store from '../store'
// 二次封装axios
const instance = axios.create({
  baseURL: import.meta.env.VITE_url + '/api',
  timeout: 5000,
})

// 请求拦截器
instance.interceptors.request.use((config) => {
  if (localStorage.getItem('token')) {
    config.headers.token = localStorage.getItem('token')
  }
  return config
})
// 响应拦截器
instance.interceptors.response.use((response) => {
  switch (response.data.code) {
    case 103:
    case 106:
      ElMessage.error(response.data.msg)
      break
    case 200:
      ElMessage({
        message: response.data.msg,
        type: 'success',
      })
      break
    case 105:
      // token校验失败跳转到登录页面
      router.push('/sign/login')
      // 清空存储的用户信息
      store.commit('setUserInfo', {})
      ElMessage.error(response.data.msg)
      break
  }
  return response
})

export default instance
