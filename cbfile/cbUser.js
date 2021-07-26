const sql = require("../config/mysql");
const querySql = require("../config/querySql");
const { PWD_SALT, PRIVATE_KEY, EXPIRESD } = require("../config/constant");
const { md5 } = require("../config/methods")
const jswt = require("jsonwebtoken");
// 引入svg-captcha模块
var svgCaptcha = require('svg-captcha');
// var uID = "zh";
class UserInfo {
    // 用户注册函数
    userRegister(req, res, next) {
        var u = {
            user: req.body.username,
            pass: req.body.password,
            age: req.body.age,
            nick: req.body.nick,
        }
        if ((u.user == "" || u.user == undefined) && (u.pass == "" || u.pass == undefined)) {
            res.send({
                msg: "信息不能为空",
                code: -1
            })
        }
        sql.query(querySql.userinfo.searchUsername, [u.user], function (result, fileds) {
            if (result.length) {
                res.send({
                    msg: "该用户已注册",
                    code: 1
                })
            } else {
                sql.query("select * from user",[],function(result){
                    console.log(result)
                    var uID;
                    if(result.length){
                        var str = result[result.length-1].uid;
                        var num =parseInt(str.slice(2))+1;
                        var uname = str.substring(0,2);
                       uID = uname+num;
                      console.log(uID);
                    }else{
                        uID = "zh1"
                    }
                    u.pass = md5(`${u.pass}${PWD_SALT}`);
                    console.log(u.pass);
                    // var addSql = "insert into user(username,password,age,nick) values(?,?,?,?)";
                    var addSqlQuery = [uID,u.user, u.pass, u.age, u.nick];
                    sql.query(querySql.userinfo.userInsert, addSqlQuery, function (result, fileds) {
                        if (fileds) {
                            throw fileds;
                            return;
                        }
                        res.send({
                            msg: "注册成功！",
                            code: 0
                        })
                    })
                })
            }
        })
    }
    // 生成验证码图片和随机码
    randomCode(req, res, next) {
        var option = {
            size: 6,  //验证码长度
            width: 80,
            height: 35,
            background: "#f4f3f2",//干扰线条数
            noise: 2,
            fontSize: 32,
            ignoreChars: '0o1i',   //验证码字符中排除'0o1i'
            color: true // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有           
        };
        // 验证码，有两个属性，text是字符，data是svg代码
        var code = svgCaptcha.create(option);
        // 保存到session,忽略大小写
        var codeText = code.text.toLowerCase();
        req.session.randomcode = codeText;
        // 返回数据直接放入页面元素展示即可
        res.send({
            img: code.data,
            code: code.text
        });
    }
    verifyCode(req, res, next) {
        var imageCode = req.query.imageCode.toLowerCase();
        if (imageCode !== req.session.randomcode) {
            res.send({
                code: 1,
                msg: '验证失败'
            });
            return false;
        } else {
            res.send({
                code: 0,
                msg: '验证成功'
            });
        }
    }
    // 用户登录函数
    userLogin(req, res, next) {
        var user = req.body.username;
        var pass = req.body.password;
        if (!user && !pass) {
            res.send({
                msg: "用户名或密码不能为空",
                code: -1
            })
        }
        //查询
        sql.query(querySql.userinfo.searchUsername, [user], function (result) {
            console.log(result[0])
            if (result.length) {
                // 首先要确保用户存在,这样我们就可以生成一个token,再constant.js进行配置
                pass = md5(`${pass}${PWD_SALT}`);
                // 当我们输入的密码和加密的密码相一致的时候,生成token
                if (result[0].password == pass) {
                    console.log(111);
                    // 生成token jswt.sign({user},密钥，过期时间)
                    let token = jswt.sign({ user }, PRIVATE_KEY, { expiresIn: EXPIRESD });
                    res.send({
                        token: token,
                        code: 0,
                        uid:result[0].uid,
                        msg: '登录成功~'
                    })
                } else {
                    res.send({
                        msg: "密码输入错误~",
                        code: 1
                    })
                }
            } else {
                res.send({
                    msg: "用户名不存在，请注册",
                    code: 2
                })
            }
        })
    }
    // 获取用户信息
    userInfo(req, res, next) {
        var username = req.query.username;
        if (username) {
            // 在这块我们获取用户信息不能将用户的密码暴露出去,username,age,nick,head_img
            sql.query(querySql.userinfo.userSearch, [username], function (result) {
                if (result.length) {
                    res.send({
                        data: result[0],
                        code: 0,
                        msg: '获取成功'
                    })
                } else {
                    res.send({
                        code: 1,
                        msg: '该用户不存在'
                    })
                }
            })
        } else {
            res.send({
                code: -1,
                msg: '用户名不能为空'
            })
        }

    }
    // 用户信息更新[需要穿token]
    userUpdate(req, res, next) {
        let gx = {
            username: req.body.username,
            age: req.body.age,
            nick: req.body.nick,
            head_img: req.body.head_img
        }
        if (gx.username) {
            sql.query(querySql.userinfo.userUpdate, [gx.age, gx.nick, gx.head_img, gx.username], function (result) {
                console.log(result)
                res.send({ code: 0, msg: '更新成功' })
            })
        } else {
            res.send({ code: 1, msg: '更新失敗' })
        }
    }
    // 用户头像上传
    userAvatarUpload(req, res, next) {
        let imgPath = req.file.path.split('public')[1];
        // 使用自己的ip地址
        // let imgUrl = 'http://127.0.0.1:3030'+imgPath
        let imgUrl = 'http://localhost:3000' + imgPath
        res.send({ code: 0, msg: '上传成功', data: imgUrl });
    }
}
module.exports = new UserInfo();