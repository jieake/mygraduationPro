/* 
    发送ajax请求有哪些参数
        type => get
        url
        async => true
        data = ""
        dataType = "JSON"
        success
*/
function Ajax(options) {
  //首先判断url
  if (!options.url) {
    throw new Error("地址不能为空!")
  }
  //设置参数默认值
  const moren = {
    type: 'get',//默认get请求
    url: "",//请求地址默认为空
    async: true,//默认异步请求
    dataType: "JSON",
    success() { },
    data: '',//可以字符串可以对象,默认为字符串
  }
  //将你传入的参数全部都要让默认里面的赋值,如果你写了,用你的,你不写用我的
  for (let key in options) {
    moren[key] = options[key]
  }

  //对数据进行基本的校验
  if (!(moren.type.toLowerCase() == 'get' || moren.type.toLocaleLowerCase() == 'post')) {
    throw new Error("请求类型异常!")
  }
  //校验URL
  if (Object.prototype.toString.call(moren.url) !== '[object String]') {
    throw new Error("请求URL不是字符串!")
  }
  //检验同异步
  if (typeof moren.async !== 'boolean') {
    throw new Error("ajax请求是同步或者异步!")
  }
  //检验期望返回的数据类型
  if (moren.dataType.toUpperCase() == "STRING" || moren.dataType.toUpperCase == "JSON") {
    throw new Error("期望返回的是字符串或者是JSON字符串!")
  }
  //校验回调函数
  if (typeof moren.success != 'function') {
    throw new Error("回调函数不是一个函数!")
  }
  //校验请求参数
  if (!(typeof moren.data == 'string' || Object.prototype.toString.call(moren.data) == '[object Object]')) {
    throw new Error("请求参数异常!")
  }
  //如果请求的是对象,那么需要将对象抓换成查询字符串
  let str = ''
  if (Object.prototype.toString.call(moren.data) == '[object Object]') {
    for (let key in moren.data) {
      //{username:admin,password:12345}
      //username=admin&password=12345
      str += `${key}=${moren.data[key]}&`
    }
    str = str.slice(0, -1)
    //将str赋值给moren.data
    moren.data = str;
  }
  //发送ajax
  const xhr = new XMLHttpRequest();
  if (moren.type.toLowerCase() == 'get') {
    xhr.open(moren.type, `${moren.url}?${moren.data}`, moren.async)
    xhr.send();
  } else {
    xhr.open(moren.type, moren.url, moren.async)
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
    xhr.send(moren.data)
  }
  xhr.onload = function () {
    if (moren.dataType.toUpperCase() == 'JSON') {
      moren.success(JSON.parse(xhr.responseText))
    } else {
      moren.success(xhr.responseText)
    }
  }
}

// 异步实现Ajax封装
function promiseAjax(obj) {
  //设置参数默认值
  const morens = {
    type: 'get',//默认get请求
    url: "",//请求地址默认为空
    async: true,//默认异步请求
    dataType: "JSON",
    success() { },
    data: '',//可以字符串可以对象,默认为字符串
  }
  //将你传入的参数全部都要让默认里面的赋值,如果你写了,用你的,你不写用我的
  for (let key in obj) {
    morens[key] = obj[key]
  }

  return new Promise(resolve => {
    Ajax({
      type: morens.type,//默认get请求
      url: morens.url,//请求地址默认为空
      async: morens.async,//默认异步请求
      dataType: morens.dataType,
      data: morens.data,//可以字符串可以对象,默认为字符串
      success(msg) {
        resolve(msg)
      },
    })
  })
}