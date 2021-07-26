//所有sql语句
module.exports = {
    userinfo:{
        // 用户新增信息
        userInsert:`insert into user(uid,username,password,age,nick) values(?,?,?,?,?)`,
        // 根据用户名查询用户信息
        searchUsername:`select * from user where username = ?`,
        // 根据用户名查询用户信息，不返回密码
        userSearch:`select username,nick,head_img,age from user where username = ?`,
        // 根据用户名更新用户信息
        userUpdate:`update user set age=?, nick = ?,head_img = ? where username = ?`
    },
    shopinfo:{
        // 轮播图添加数据
        bannerAdd:`insert into banner(img,name) values(?,?)`,
        // 轮播图查询
        bannerSearch:`select * from banner`,
        // 商品分类查询
        sortSearch:`select * from classic`,
        // 指定商品分类查询添加
        sortSearchAdd:`insert into goods(name,img,sort,date,price,shop_name,desc,provcity) values(?,?,?,?,?,?,?,?)`,
        // 查询所有指定商品分类
        sortSearchAll:'select * from goods',
        // 指定分类查询商品
        sortSearchOne:`select * from goods where sort=?`,
        // 商品搜索框模糊查询
        // likeSeach:`select * from goods where name like '%${data.sousuo}%'`,
        searchShopId:`select * from goods where goods_id=?`,
        // 添加购物车
        addCart:`insert into cart(goods_id,uid,gname,img,price,status,num) values(?,?,?,?,?,?,?)`,
        // 通过id查询购物车数据
        cartID:`select * from cart where goods_id=?`,
        // 购物车查看功能
        cartSearch:`select * from cart where uid=?`,
        // 购物车的删除
        cartDelete:`delete from cart where goods_id=?`,
        // 添加订单
        addOrder:`insert into goodsorder(goods_id,uid,gname,num,price,img,create_time,order_code) values(?,?,?,?,?,?,?,?)`,
        //根据id查找订单
        searchOrder:`select * from goodsorder where goods_id=?`,
        // 根据用户uid查询
        searchOrderUid:`select * from goodsorder where uid=?`
    }
}   