/**
 * @Description: #TODO 获取管理员信息表
 * @Author: 胡歌
 * @Date: 2023-03-08 17:53:19
 */

getAdmins()
function getAdmins() {
  const tbody = document.querySelector('tbody')
  tbody.innerHTML = ''
  axios({
    method: 'post',
    url: 'http://localhost:3000/admin/admin/getAdminList',
    headers: { token: sessionStorage.getItem('token') }
  }).then(res => {
    res.data.forEach(element => {
      // 渲染页面
      const tr = document.createElement('tr')
      for (let key in element) {
        if (key !== 'id') {
          const td = document.createElement('td')
          if (key === 'avatar') {
            const img = document.createElement('img')
            if (!element[key]) {
              img.src = '../upload/default.jpg'
            } else {

              img.src = '../' + element[key]
            }
            td.appendChild(img)
          } else {

            td.innerText = element[key]
          }
          tr.appendChild(td)
        }
      }

      tbody.appendChild(tr)
    });
  })
}
