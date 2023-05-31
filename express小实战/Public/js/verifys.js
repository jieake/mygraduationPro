/**
 * @Description: 判断是否存在token并把token发送给服务器校验
 * @Author: 胡歌
 * @Date: 2023-03-03 20:46:25
 */
getKey()
function getKey() {
  if (!(sessionStorage.getItem('token'))) {
    alert('请登录！')
    window.location.href = '../login.html'
    return
  } else {

    axios({
      url: 'http://localhost:3000/admin/admin/verifys',
      method: 'post',
      headers: { token: sessionStorage.getItem('token') }
    }).then(result => {
      if (result.data.code !== 200) {
        alert('token失效，请登录！')
        sessionStorage.removeItem('token')
        window.location.href = '../login.html'
      }
    })

  }
}