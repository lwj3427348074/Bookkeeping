const express = require('express');
const router = express.Router();

//moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware')

//添加首页路由
router.get('/', (req, res) => {
  //重定向 /account
  res.redirect('/account')
});

//记账本列表
router.get('/account', checkLoginMiddleware, function (req, res, next) {
  //获取所有的账单信息
  AccountModel.find().sort({ time: -1 }).then((data) => {
    console.log(data);
    res.render('list', { accounts: data, moment: moment })
  }).catch((err) => {
    res.status(500).render('fail', { msg: '读取失败', url: '/account' })
  })
});

//添加记录
router.get('/account/create', checkLoginMiddleware, function (req, res, next) {
  res.render('create')
});

//新增记录
router.post('/account', checkLoginMiddleware, (req, res) => {
  // 使用moment '2024-02-24' => object => new Date()
  // 插入数据库
  AccountModel.create({
    ...req.body,
    //修改time属性的值
    time: moment(req.body.time).toDate()
  }).then((data) => {
    res.render('success', { msg: '添加成功', url: '/account' })
  }).catch((err) => {
    console.log(err);
    res.status(500).render('fail', { msg: '插入失败', url: '/account/create' })
  })
})

//删除记录
router.get('/account/:id', checkLoginMiddleware, (req, res, next) => {
  let id = req.params.id
  //删除
  AccountModel.deleteOne({ _id: id }).then((data) => {
    res.render('success', { msg: '删除成功', url: '/account' })
  }).catch((err) => {
    res.status(500).render('fail', { msg: '删除失败', url: '/account' })
  })


});

module.exports = router;
