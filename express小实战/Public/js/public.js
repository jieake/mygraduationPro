const timer = document.querySelector('.timer')
const user = document.querySelector('.user')
timer.innerText = new Date().toLocaleString()

/**
 * @Description: #TODO // 获取时间
 * @Author: 胡歌
 * @Date: 2023-03-08 17:53:59
 */
function getTimes() {
  setInterval(() => {
    timer.innerText = new Date().toLocaleString()
  }, 1000)
}
getTimes()

/**
 * @Description: #TODO // 获取登录者姓名
 * @Author: 胡歌
 * @Date: 2023-03-08 17:54:08
 */
getName()
function getName() {
  // 姓名
  const username = sessionStorage.getItem('userN')
  const uName = document.querySelector('#uName')
  const strongName = document.querySelector('#strongName')
  uName.innerHTML = username
  strongName.innerText = username

}

/**
 * @Description: #TODO // 获取登录者头像
 * @Author: 胡歌
 * @Date: 2023-03-08 17:54:15
 */
getAvatar()
function getAvatar() {
  axios({
    url: 'http://localhost:3000/admin/admin/getAvatar',
    method: 'post',
    data: { id: sessionStorage.getItem('userd') }
  }).then(result => {
    // 获取左下角头像元素
    const avatarBt = document.querySelector('#avatarBt')
    avatarBt.src = result.data.avatar
    // 获取头部头像元素
    const avatarTp = document.querySelector('#avatarTp')
    avatarTp.src = result.data.avatar
  })

}


/**
 * @Description: #TODO // 点击退出时删除所有session以及token
 * @Author: 胡歌
 * @Date: 2023-03-08 17:54:22
 */
exitSys()
function exitSys() {
  const exitA = document.querySelector('a.exits')
  exitA.onclick = function (e) {
    e.preventDefault()
    let flag = confirm('确认退出吗？')
    if (flag) {
      sessionStorage.clear()
      location.href = '../login.html'
    }
  }
}
