/**
 * @Description: #TODO // 上传头像
 * @Author: 胡歌
 * @Date: 2023-03-08 17:54:33
 */
uploadAvatar()
function uploadAvatar() {
  // 本地显示图片
  // 获取显示元素
  const showimg = document.querySelector('#showimg')
  showimg.innerHTML = ''
  // 创建img
  const img = new Image(300, 200)
  img.src = 'http://localhost:3000/upload/default.gif'
  // 添加入showimg显示元素
  showimg.appendChild(img)

  // 获取头像input
  const formFileAvatar = document.querySelector('#formFileAvatar')

  formFileAvatar.onchange = function () {
    const files = formFileAvatar.files[0]
    if (files) {
      // 本地显示图片
      // 获取显示元素
      const showimg = document.querySelector('#showimg')
      showimg.innerHTML = ''
      // 1，拿到input上传图片数据后，创建一个FileReader对象
      const reader = new FileReader()
      // 2，调用readAsDataURL读取数据
      reader.readAsDataURL(files)
      // 3，监听reader对象处理完成后进行处理
      reader.onload = () => {
        // 4，拿到读取结果
        const url = reader.result
        // 4，创建img
        const img = new Image(300, 200)
        // 5，赋值
        img.src = url
        showimg.appendChild(img)
      }
    }
  }
  const btn = document.querySelector('#formFileAvatar+input')
  btn.addEventListener('click', () => {
    // 获取文件域表单的值
    const file = formFileAvatar.files[0]
    // axios({
    //   url: 'http://localhost:3000/admin/admin/changeAvatar',
    //   method: 'upload',
    //   data: {
    //     formFileAvatar
    //   }
    // })
    const userd = sessionStorage.getItem('userd')
    const formData = new FormData()

    // 加入表单格式化中
    formData.append('userd', userd)
    if (!file.type.startsWith('image')) {
      return alert('请上传图片！')
    }
    if (file) {
      // 添加进格式化表单中
      formData.append('logo', file)
      fetch('admin/changeAvatar', {
        method: 'post',
        // headers: { 'content-type': 'multipart/form-data' },
        // 必须是对象
        headers: { token: sessionStorage.getItem('token') },
        body: formData, //上传
      })
        .then((result) => {
          return result.json()
        })
        .then((result) => {
          console.log(result)
          result.code === 200 ? alert('上传成功！') : alert('请重新上传')
        })
    } else {
      alert('请选择文件！')
    }
  })
}

/**
 * @Description: #TODO 修改密码
 * @Author: 胡歌
 * @Date: 2023-03-08 19:08:44
 */
editPassword()
function editPassword() {
  // 获取确认修改密码按钮
  const edtPassBtn = document.querySelector('#editPassw')
  edtPassBtn.addEventListener('click', () => {
    // 获取旧密码
    const oldPsw = document.querySelector('input[placeholder="旧密码"]').value.trim()
    // 获取新密码
    const newPsw = document.querySelector('input[placeholder="新密码"]').value.trim()
    // 获取确认新密码
    const okPsw = document.querySelector('input[placeholder="确认新密码"]').value.trim()
    // 1，首先判断旧密码是否正确
    axios({
      method: 'post',
      url: 'admin/admin/conparePssw',
      data: { userd: sessionStorage.getItem('userd'), oldPsw },
      headers: { token: sessionStorage.getItem('token') },
    }).then((result) => {
      if (result.data.code !== 200) {
        alert('输入的旧密码不正确')
        return
      } else {
        if (!newPsw.length || !okPsw.length) {
          alert('密码不能为空')
          return
        }
        // 判断输入的两个新密码是否一样
        if (newPsw === okPsw) {
          axios({
            url: 'admin/admin/editPsw',
            method: 'post',
            data: { userpsw: newPsw, userd: sessionStorage.getItem('userd') },
            headers: { token: sessionStorage.getItem('token') },
          }).then((res) => {
            if (res.data.code === 200) {
              alert('密码修改成功')
            } else {
              alert('密码修改失败')
            }
          })
        } else {
          alert('请输入相同的新密码')
        }
      }
    })
  })
}
