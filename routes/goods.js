var express = require('express');
var router = express.Router();
const cbShop = require("../cbfile/cbShop")
/* GET users listing. */
// 添加
// banner表 轮播图添加
router.get('/banner', cbShop.bannerAdd);
// sortSearch表添加
router.get('/sort_search', cbShop.sortSearchAdd);
// 查询轮播图
router.get('/banner_one',cbShop.bannerSearch);
// sort表  查询分类
router.get('/sort_one', cbShop.sortSearch);
// 查询所有   sortSearch表
router.get('/sort_search_all',cbShop.sortSearchAll);
// 分类查询  sortSearch表    sort = data.sousuo
router.get('/sort_has', cbShop.sortSearchOne);
// 搜索框查询    sortSearch表   name like %data.sousuo%
router.get('/sousuo',cbShop.likeSeach);
// id查询sousuo = data.sousuo
router.get('/id_has', cbShop.searchShopId);
// 加入购物车
router.get("/add_cart",cbShop.addCart)
// 购物车单个删除
router.get("/cart_delete",cbShop.cartdelete)
// 购物车查询
router.get("/cart_search",cbShop.cartSearch)
// 生成订单
router.get("/create_order",cbShop.createOrder)
router.get("/search_order",cbShop.searchOrder)
module.exports = router;
