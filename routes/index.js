var express = require('express');
var router = express.Router();
//引入接口方法
// let cbfile = require("../cbfile/cbfile.js");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
// 注册
// router.post('/register', cbfile.register);
// // 登录
// router.post('/login', cbfile.login);
// //查看
// router.post('/has', cbfile.has);
// //修改
// router.post('/change', cbfile.has_change);
// router.post('/has_change', cbfile.change);

module.exports = router;