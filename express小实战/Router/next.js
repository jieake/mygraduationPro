const router = require('express').Router();
const {
  getCheckCode,
  login,
  verifys,
  changeAvatar,
  getAvatars,
  getAdmins,
  conparePsw,
  editAdmPsw,
} = require('../Controller');
// 引入multer
const multer = require('multer');
// 引入token校验
const jwt = require('jsonwebtoken');
const { keyObj } = require('../config');

// 设置上传文件保存路径
// const upload = multer({ dest: 'upload/' })
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'public/upload/');
    },
    filename(req, file, cb) {
      // fieldname是表单的name值，也就是我们设定的“logo”，
      // originalname是文件上传时的名字，可以根据它获取后缀，
      // encoding，mimetype 我就不详细介绍了，可以自行输出查看。
      const { fieldname, originalname, encoding, mimetype } = file;
      // const after = originalname.split('.')[1] ? '.' + originalname.split('.')[1] : '.jpg'
      cb(null, originalname);
    },
  }),
});

// 三级路由：获取验证码
router.get('/getCheckCode', getCheckCode);
// 三级路由：登录接口
router.post('/login', login);
// 三级路由：校验token是否合法
router.post('/verifys', verifys);
// 三级路由中间件：修改头像
router.post('/changeAvatar', upload.single('logo'), changeAvatar);
// 三级路由：获取头像
router.post('/getAvatar', getAvatars);
// 三级路由：获取管理员信息表
router.post(
  '/getAdminList',
  (req, res, next) => {
    jwt.verify(req.headers.token, keyObj, err => {
      if (err) {
        res.send({ code: 105, msg: 'token校验错误' });
      } else {
        next();
      }
    });
  },
  getAdmins
);
// 三级路由: 获取密码与用户输入的密码进行比对
router.post(
  '/conparePssw',
  (req, res, next) => {
    jwt.verify(req.headers.token, keyObj, err => {
      if (err) {
        res.send({ code: 105, msg: 'token校验错误' });
      } else {
        next();
      }
    });
  },
  conparePsw
);

// 访问数据库修改密码
router.post(
  '/editPsw',
  (req, res, next) => {
    jwt.verify(req.headers.token, keyObj, err => {
      if (err) {
        res.send({ code: 105, msg: 'token校验错误' });
      } else {
        next();
      }
    });
  },
  editAdmPsw
);

// 暴露路由供访问
module.exports = router;
