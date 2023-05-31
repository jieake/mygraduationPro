const spanUser = document.querySelector('#spanUser')
const spanPass = document.querySelector('#spanPass')

const codes = document.querySelector("#checkCode")
const usernames = document.querySelector('#username')
const passwords = document.querySelector('#password')

const showsImg = document.querySelector('#shows')

/**
 * @Description: #TODO 显示隐藏密码
 * @Author: 胡歌
 * @Date: 2023-03-08 17:52:40
 */
function showPass() {
  if (showsImg.dataset.s == 1) {
    showsImg.src = './image/R-C.jfif'
    showsImg.dataset.s = 0
    passwords.type = 'text'
  } else {
    showsImg.src = './image/R-C (1).jfif'
    showsImg.dataset.s = 1
    passwords.type = 'password'
  }
}
showsImg.addEventListener('click', () => {
  showPass()
})


/**
 * @Description: #TODO 获取验证码
 * @Author: 胡歌
 * @Date: 2023-03-08 17:52:24
 */
const errMsg = document.querySelector('#errMsg')
getCode()
function getCode() {
  const code = document.querySelector('#spanCode')
  Ajax({
    url: 'http://localhost:3000/admin/admin/getCheckCode',
    success(obj) {
      code.innerText = obj.msg
      sessionStorage.setItem('code', obj.msg)
    }
  })
}
// 点击切换验证码
const spanCode = document.querySelector('#spanCode')
spanCode.addEventListener('click', () => {
  getCode()
})


/**
 * @Description: #TODO 登录
 * @Author: 胡歌
 * @Date: 2023-03-08 17:52:02
 */
function logins() {
  const code = codes.value.trim()
  const username = usernames.value.trim()
  const password = passwords.value.trim()

  const serverCode = sessionStorage.getItem('code')
  if (!/^[\u2E80-\u9FFF]{2,8}$/.test(username)) {
    spanUser.style.visibility = 'visible'
    spanUser.style.color = 'red'
    spanUser.innerText = '账号格式错误'
    usernames.value = ''
    return
  }
  spanUser.style.visibility = 'visible'
  spanUser.innerText = '✔'
  spanUser.style.color = 'blue'
  if (!/^\d{6,16}$/.test(password)) {
    spanPass.style.visibility = 'visible'
    spanPass.style.color = 'red'
    spanPass.innerText = '密码格式错误'
    passwords.value = ''
    return
  }
  spanPass.style.visibility = 'visible'
  spanPass.innerText = '✔'
  spanPass.style.color = 'blue'
  if (code !== serverCode) {
    errMsg.style.visibility = 'visible'
    errMsg.style.color = 'red'
    errMsg.innerText = '验证码错误'
    codes.value = ''
    return
  }
  errMsg.style.visibility = 'visible'
  errMsg.innerText = '✔'
  errMsg.style.color = 'blue'
  // Ajax({
  //   type: 'post',
  //   url: 'http://localhost:3000/admin/admin/login',
  //   data: { username, password },
  //   dataType: 'JSON',
  //   success(obj) {
  //     if (obj.code == 200) {
  //       alert(obj.msg)
  //       window.location.href = './admin/home.html'
  //     } else {
  //       usernames.value = ''
  //       passwords.value = ''
  //       codes.value = ''
  //       alert(obj.msg)
  //     }
  //   }
  // })


  /**
   * @Description: #TODO 使用promise封装的ajax进行请求
   * @Author: 胡歌
   * @Date: 2023-03-08 17:53:43
   */
  promiseAjax({
    type: 'post',
    url: 'http://localhost:3000/admin/admin/login',
    data: { username, password },
    dataType: 'JSON',
    // success(obj) {
    //   if (obj.code == 200) {
    //     alert(obj.msg)
    //     window.location.href = './admin/home.html'
    //   } else {
    //     usernames.value = ''
    //     passwords.value = ''
    //     codes.value = ''
    //     alert(obj.msg)
    //   }
    // }
  }).then(res => {
    if (res.code === 200) {
      alert(res.msg)
      sessionStorage.clear()
      sessionStorage.setItem('userN', res.username)
      sessionStorage.setItem('token', res.token)
      console.log(res);
      sessionStorage.setItem('userd', res.userd)
      location.href = './admin/home.html'
    } else {
      usernames.value = ''
      passwords.value = ''
      codes.value = ''
      alert(res.msg)
    }
  })
}
const btn = document.querySelector('#btnLog')
btn.addEventListener('click', () => {

  logins()
})
document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    logins()
  }
})
