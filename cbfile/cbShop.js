const sql = require("../config/mysql");
const querySql = require("../config/querySql");
class CbShop {
    // 添加轮播图
    bannerAdd(req, res, next) {
        let data = req.query;
        // let sqladd= "insert into banner(img,name) values(?,?)";
        let sqlvalue = [data.img, data.name];
        sql.query(querySql.shopinfo.bannerAdd, sqlvalue, result => {
            res.send({      //添加成功
                msg: "添加成功！",
                code: 0
            });
        })
    }
    // 查询轮播图
    bannerSearch(req, res, next) {
        // let sqladd= "select * from banner";
        let sqlvalue = [];
        sql.query(querySql.shopinfo.bannerSearch, sqlvalue, result => {
            res.send({      //添加成功
                msg: "查询成功！",
                code: 0,
                data: result
            });
        })
    }
    // 指定添加商品
    sortSearchAdd(req, res, next) {
        let data = req.query;
        let date = new Date();
        let Year = date.getFullYear();      //年
        let Month = date.getMonth() + 1;    //月
        let ri = date.getDate();            //日
        let Hours = date.getHours();        //小时
        let Minutes = date.getMinutes();    //分钟
        date = `${Year}年${Month}月${ri}日${Hours}点${Minutes}分`;
        console.log(typeof date);
        // 价格、名称、说明、来源城市
        let sqlvalue = [data.name, data.img, data.sort, date, data.price, data.shop_name, data.desc, data.provcity];
        sql.query(querySql.sortSearchAdd, sqlvalue, result => {
            res.send({      //添加成功
                msg: "添加成功！",
                code: 0,
                date
            });
        })
    }
    // 商品分类查询
    sortSearch(req,res,next){
        let sqlvalue = [];
        sql.query(querySql.shopinfo.sortSearch, sqlvalue, result => {
            res.send({      //查询成功
                msg: "查询成功！",
                code: 0,
                data:result
            });
        })
    }
    sortSearchAll(req,res,next){
        let sqlvalue = [];
        sql.query(querySql.shopinfo.sortSearchAll, sqlvalue, result => {
            res.send({      //添加成功
                msg: "查询成功！",
                code: 0,
                data:result
            });
        })
    }
    sortSearchOne(req,res,next){
        let data = req.query.sortName;
        sql.query(querySql.shopinfo.sortSearchOne, [data], result => {
            res.send({      //添加成功
                msg: "成功！",
                code: 0,
                data:result
            });
        })
    }
    likeSeach (req, res, next) {
        let data = req.query;
        let sqladd= `select * from sortsearch where name like '%${data.sousuo}%'`;
        let sqlvalue = [];
        sql.query(sqladd, sqlvalue, result => {
            res.send({      //添加成功
                msg: "成功！",
                code: 0,
                data:result
            });
        })
    }
    searchShopId(req,res,next){
        let id = req.query.id;
        if(id){
            sql.query(querySql.shopinfo.searchShopId, [id], result => {
                if(result.length){
                    res.send({      //添加成功
                        msg: "成功！",
                        code: 0,
                        data:result
                    });
                }else{
                    res.send({      //添加成功
                        msg: "商品ID不存在",
                        code: 1,
                        data:null
                    });
                }
                
            })
        }else{
            res.send({      //添加成功
                msg: "商品ID不能为空",
                code: -1,
            });
        }
        
    }
    //加入购物车
    addCart(req,res,next){
        let cart = {
            goods_id:req.query.goods_id,
            uid:req.query.uid,
            gname:req.query.gname,
            img:req.query.img,
            price:req.query.price,
            status:req.query.status,
            num:req.query.num
        }
        // console.log(cart);
        if(cart.goods_id){
            // 根据id查询数据库，如果数据库中已有该商品，那么不能重复添加
            sql.query(querySql.shopinfo.cartID,[cart.goods_id],function(result){
                if(result.length){
                    res.send({      //添加成功
                        msg: "该商品已添加到购物车，请勿重复添加",
                        code: -1
                    });
                }else{
                    var sqlVal = [cart.goods_id,cart.uid,cart.gname,cart.img,cart.price,cart.status,cart.num];
                    sql.query(querySql.shopinfo.addCart,sqlVal,(result)=>{
                        res.send({      //添加成功
                            msg: "添加成功！",
                            code: 0
                        });
                    })
                }
            })
           
        }else{
            res.send({
                msg:"商品id不能为空",
                code:1
            })
        }
    }
    // 删除购物车单个商品
    cartdelete(req,res,next){
        var id = req.query.goods_id;
        if(id){
            sql.query(querySql.shopinfo.cartDelete,[id],result=>{
                res.send({     
                    msg: "删除成功",
                    code: 0
                });
            })
        }else{
            res.send({     
                msg: "商品id不能为空",
                code: 1
            });
        }
    }
    // 根据用户id查询购物车数据
    cartSearch(req,res){
        var uid = req.query.uid;
        if(uid){
            sql.query(querySql.shopinfo.cartSearch,[uid],result=>{
                if(result.length){
                    res.send({
                        msg:'查询成功',
                        code:0,
                        data:result
                    })
                }else{
                    res.send({
                        msg:"暂无数据,请添加",
                        code:1
                    })
                }
            })
        }else{
            res.send({
                msg:"请输入用户id",
                code:-1
            })
        }
    }
    // 生成订单
    createOrder(req,res){
        console.log(req.query);
        /**/
        var goods_id =req.query.goods_id;
        var uid = req.query.uid;
        var gname = req.query.gname;
        var img = req.query.img;
        var price = parseFloat(req.query.price);
        var num = parseInt(req.query.num);
        // 生成订单  时间戳+随机数
        var orderCode = new Date().getTime()+''+parseInt(Math.random() * 1000);
        // 订单生成时间
        let create_time = new Date();
        let Year = create_time.getFullYear();      //年
        // 月
        let Month = (create_time.getMonth() + 1) > 10 ? (create_time.getMonth() + 1) : "0" +(create_time.getMonth() + 1);    
        let ri = create_time.getDate() > 10 ? create_time.getDate() : "0"+create_time.getDate();            //日
        // 小时
        let Hours = create_time.getHours()>10 ? create_time.getHours() : "0"+create_time.getHours(); 
        // 分钟
        let Minutes = create_time.getMinutes() >10 ? create_time.getMinutes() : "0"+create_time.getMinutes();   
        // 秒
        let Seconds = create_time.getSeconds() > 10 ? create_time.getSeconds() : "0"+create_time.getSeconds(); 
        create_time = `${Year}-${Month}-${ri} ${Hours}:${Minutes}:${Seconds}`;
        var sqlVal = [goods_id,uid,gname,num,price,img,create_time,orderCode];
        if(goods_id && uid){
            sql.query(querySql.shopinfo.searchOrder,[goods_id],result=>{
                if(result.length){
                    res.send({
                        msg:"商品订单已存在",
                        code:1
                    })
                    
                }else{
                    sql.query(querySql.shopinfo.addOrder,sqlVal,result=>{
                        sql.query(querySql.shopinfo.cartDelete,[goods_id],result=>{
                            res.send({     
                                msg: "订单提交成功",
                                code: 0
                            });
                        })
                    })
                }
            })
        }else{
            res.send({
                msg:"用户名和商品id不能为空",
                code:-1
            })
        }
        
    }
    // 订单查询
    searchOrder(req,res){
        var uid = req.query.uid;
        if(uid){
            sql.query(querySql.shopinfo.searchOrderUid,[uid],result=>{
                if(result){
                    res.send({
                        msg:"订单查询成功",
                        code:0,
                        data:result
                    })
                }else{
                    res.send({
                        msg:"该用户暂无订单",
                        code:1
                    })
                    
                }
            })
        }else{
            res.send({
                msg:"用户id不能为空",
                code:-1
            })
        }
    }
}
module.exports = new CbShop();