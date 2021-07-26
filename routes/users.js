var express = require("express");
var router = express.Router();
//引入接口方法
let cbUser = require("../cbfile/cbUser");
const {upload}=require("../config/methods")
// 用户注册
router.post("/register",cbUser.userRegister);
// 登录
router.post("/login",cbUser.userLogin);
// 设置验证码访问路径，请求方式为get
router.get("/create_code",cbUser.randomCode);
// 验证验证码接口，请求方式get
router.get('/verification_code', cbUser.verifyCode);

// 获取用户信息
router.get('/userinfo',cbUser.userInfo);
// 用户头像上传
router.post('/upload',upload.single('head_img'),cbUser.userAvatarUpload);
// 用户信息更新[需要穿token]
router.post('/updateuser',cbUser.userUpdate)
module.exports = router