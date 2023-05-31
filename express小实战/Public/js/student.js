

/**
 * @Description: #TODO 与后台交互获取数据并渲染页面
 * @Author: 胡歌
 * @Date: 2023-03-08 17:54:57
 */
getStuMsg()
function getStuMsg() {
  // 获取table的tbody
  const tbody = document.querySelector('.table tbody')
  tbody.innerHTML = ''
  // 获取页面当前页
  const pageNow = document.querySelector('#pageNow').innerHTML.trim()
  // 获取页面显示页数
  let pageNum = document.querySelector('#pageNum').value.trim()
  if (!+pageNum) {
    pageNum = 10
  }

  // 发送ajax数据
  axios({
    url: `student/query?pageNow=${+pageNow}&pageNum=${+pageNum}`,
    // 必须是对象
    headers: { token: sessionStorage.getItem('token') },
  }).then(result => {
    const newData = result.data.filter(item => {
      return item.flag == 1
    })
    newData.forEach(element => {
      // 渲染页面
      const tr = document.createElement('tr')
      for (let key in element) {
        if (key !== 'sid' && key !== 'flag') {

          const td = document.createElement('td')
          td.innerText = element[key]
          tr.appendChild(td)
        }
      }
      const td = document.createElement('td')
      td.innerHTML = `
      <button type="button" class="btn btn-danger btn-sm del" data-index=${element.sid}>删除</button>
      <button type="button" class="btn btn-warning btn-sm edt" data-index=${element.sid}>修改</button>
      `
      tr.appendChild(td)
      tbody.appendChild(tr)
    });
  })

  // 重新获取总页数
  getPageSum()
}

/**
 * @Description: #TODO 获取分页总共多少页
 * @Author: 胡歌
 * @Date: 2023-03-08 17:55:07
 */
getPageSum()
function getPageSum() {
  // 获取总页数显示
  const pageSum = document.querySelector('#pageSum')
  // 获取页面显示页数
  let pageNum = document.querySelector('#pageNum').value.trim()
  if (!+pageNum) {
    pageNum = 10
  }
  axios({
    url: `student/getPageS?pageNum=${pageNum}`,
    // 必须是对象
    headers: { token: sessionStorage.getItem('token') },
  }).then(result => {
    pageSum.innerText = result.data.count
  })
}

/**
 * @Description: #TODO // 点击首页
 * @Author: 胡歌
 * @Date: 2023-03-08 17:55:16
 */
indexClick()
function indexClick() {
  const indexp = document.querySelector('#indexp')
  indexp.onclick = function () {
    // 获取页面当前页
    const pageNow = document.querySelector('#pageNow')
    pageNow.innerHTML = 1
    getStuMsg()
  }
}

/**
 * @Description: #TODO // 点击尾页
 * @Author: 胡歌
 * @Date: 2023-03-08 17:55:24
 */
footClick()
function footClick() {
  // 获取尾页按钮
  const footp = document.querySelector('#footp')
  footp.onclick = function () {
    // 获取页面当前页
    const pageNow = document.querySelector('#pageNow')
    // 获取总页数
    const pageSum = document.querySelector('#pageSum')
    pageNow.innerHTML = +pageSum.innerHTML.trim()
    getStuMsg()
  }
}


/**
 * @Description: #TODO // 点击上一页
 * @Author: 胡歌
 * @Date: 2023-03-08 17:55:34
 */
uppClick()
function uppClick() {
  // 获取页面当前页
  const pageNow = document.querySelector('#pageNow')
  // 获取上一页按钮
  const upp = document.querySelector('#upp')
  // const downp = document.querySelector('downp')
  upp.addEventListener('click', () => {
    if (+pageNow.innerHTML.trim() === 1) {
      pageNow.innerHTML = 1
      return
    }
    pageNow.innerHTML--
    getStuMsg()
  })
}


/**
 * @Description: #TODO // 点击下一页
 * @Author: 胡歌
 * @Date: 2023-03-08 17:55:42
 */
downpClick()
function downpClick() {
  // 获取页面当前页
  const pageNow = document.querySelector('#pageNow')
  // 获取上一页按钮
  const downp = document.querySelector('#downp')
  // const downp = document.querySelector('downp')
  downp.addEventListener('click', () => {
    const pageSum = document.querySelector('#pageSum')
    if (+pageNow.innerHTML.trim() === +pageSum.innerHTML.trim()) {
      pageNow.innerHTML = +pageSum.innerHTML.trim()
      return
    }
    pageNow.innerHTML++
    getStuMsg()
  })
}



/**
 * @Description: #TODO // 获取下拉框改变每页显示页数
 * @Author: 胡歌
 * @Date: 2023-03-08 17:55:50
 */
editPage()
function editPage() {
  // 获取下拉框
  const pageNum = document.querySelector('#pageNum')
  pageNum.onchange = function () {
    // 重新获取总页数
    getPageSum()
    // 改变当前页数为第一页
    const pageNow = document.querySelector('#pageNow')
    pageNow.innerText = 1
    // 重新渲染页面
    getStuMsg()
  }
}

/**
 * @Description: #TODO 点击删除和修改按钮
 * @Author: 胡歌
 * @Date: 2023-03-08 17:55:59
 */
// 删除事件
function delTr(e) {
  axios({
    url: 'admin/student/dels',
    // 必须是对象
    headers: { token: sessionStorage.getItem('token') },
    method: 'delete',
    data: { sid: e.target.dataset.index }
  }).then(result => {
    if (result.data.code == 200) {
      getStuMsg()
    } else {
      alert('删除失败')
    }
  })
}
// 修改事件
function editTr(e, tr) {


  // 将tr的子元素伪数组改造成真数组
  const trList = [...tr.children].slice(0, -1)
  // 改造tr中的td
  trList.map(item => {
    const oldV = item.innerText
    const input = document.createElement('input')
    input.type = "text"
    input.value = `${oldV}`
    input.style.height = '35px'
    input.style.width = '120px'
    item.innerHTML = ''
    item.appendChild(input)
    return
  })
}



/**
 * @Description: #TODO // 利用事件委派
 * @Author: 胡歌
 * @Date: 2023-03-08 17:56:21
 */
// 获取修改按钮的父级的父级tr
operaData()
function operaData() {
  // 获取tbody元素
  const tbody = document.querySelector('tbody')
  tbody.addEventListener('click', (e) => {

    // 删除
    if (e.target.className.includes('del')) {
      if (confirm('确认删除？')) {
        delTr(e)
      }
      return
    }

    // 修改
    if (e.target.className.includes('edt')) {

      const tr = e.target.parentElement.parentElement

      // 拷贝一份tr
      const newTr = tr.cloneNode(true)
      // 获取修改按钮的兄弟元素
      const sibliEle = e.target.previousElementSibling
      e.target.innerText = '确认'
      sibliEle.innerText = '取消'
      // 修改事件
      editTr(e, tr)

      // 确认事件
      // 先移除绑定的修改事件
      e.target.removeEventListener('click', editTr)
      // 确认修改
      e.target.addEventListener('click', (e) => {
        const newTrList = tr.querySelectorAll('input')
        axios({
          method: 'post',
          url: 'admin/student/editData',
          headers: { token: sessionStorage.getItem('token') },
          data: {
            sid: e.target.dataset.index,
            sname: newTrList[0].value,
            sphone: newTrList[1].value,
            sgender: newTrList[2].value,
            sage: newTrList[3].value,
            sscore: newTrList[4].value,
            clazzid: newTrList[5].value,
          }
        }).then(result => {
          if (result.data.code == 200) {
            alert('修改成功！')
          }
        })
        // 重新渲染
        getStuMsg()
      })


      // 取消修改
      // 先移除绑定的删除事件
      sibliEle.classList.toggle('del')
      // 取消修改事件
      sibliEle.addEventListener('click', (e) => {
        tbody.insertBefore(newTr, e.target.parentElement.parentElement)
        e.target.parentElement.parentElement.remove()
      })
    }
  })
}

/**
 * @Description: #TODO // 添加事件
 * @Author: 胡歌
 * @Date: 2023-03-08 17:56:31
 */
addData()
function addData() {
  // 获取点击添加按钮
  const addDatas = document.querySelector('#addDatas')
  addDatas.addEventListener('click', () => {
    const form = document.querySelector('#staticBackdrop .modal-body form')
    // 获取所有input
    const inputList = form.querySelectorAll('input')
    const newInputList = [...inputList]
    const arr = []
    // 将填入的数据存入数组
    newInputList.map(item => {
      if (item.value === '男' || item.value === '女') {
        item.checked ? arr.push(item.value) : ''
      }
      else {
        arr.push(item.value)
      }
      return
    })
    // 发送ajax
    axios({
      url: 'admin/student/addData',
      method: 'post',
      // 必须是对象
      headers: { token: sessionStorage.getItem('token') },
      data: arr
    }).then(result => {
      if (result.data.code === 200) {
        window.location.reload()
      }
    })
  })
}


/**
 * @Description: #TODO // 搜索事件
 * @Author: 胡歌
 * @Date: 2023-03-08 17:56:43
 */
searchStart()
function searchStart() {
  // 获取用户输入数据
  const searIpt = document.querySelector("#sear-ipt")
  const searBtns = document.querySelector("span.searBtns")

  searIpt.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      searBtns.click()

    }
  })
  // 获取搜索按钮
  searBtns.addEventListener('click', () => {
    if (!searIpt.value.trim()) {
      return
    }
    axios({
      url: 'http://localhost:3000/admin/student/searchStudent',
      method: 'post',
      data: { sname: searIpt.value },
      // 必须是对象
      headers: { token: sessionStorage.getItem('token') },
    }).then(result => {
      if (result.data.code === 200) {
        // 改变当前页数为第一页
        const pageNow = document.querySelector('#pageNow')
        pageNow.innerText = 1
        getPageSum()
        getStuMsg()
      }
    })
  })
}

/**
 * @Description: #TODO // 重置事件
 * @Author: 胡歌
 * @Date: 2023-03-08 17:56:52
 */
resetEvent()
function resetEvent() {
  const btn = document.querySelector('#resetBtn')
  btn.addEventListener('click', function () {
    axios({
      method: 'get',
      url: 'http://localhost:3000/admin/student/resetMsg',
      // 必须是对象
      headers: { token: sessionStorage.getItem('token') },
    }).then(res => {
      if (res.data.code === 200) {
        getStuMsg()
        getPageSum()
      }
    })
  })
}

