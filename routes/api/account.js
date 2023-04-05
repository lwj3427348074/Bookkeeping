const express = require('express');
const AccountModel = require('../../models/AccountModel');
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware')

const router = express.Router();
//moment
const moment = require('moment');

//记账本列表
router.get('/account', checkTokenMiddleware, function (req, res, next) {
  //获取所有的账单信息
  AccountModel.find().sort({ time: -1 }).then((data) => {
    res.json({
      //响应编号
      code: '0000',
      //响应的信息
      msg: '读取成功',
      //响应的数据
      data: data,
    })
  }).catch((err) => {
    res.json({
      code: '1001',
      msg: '读取失败',
      data: null,
    })
  })
})

//新增记录
router.post('/account', checkTokenMiddleware, (req, res) => {
  // 使用moment '2024-02-24' => object => new Date()
  // 插入数据库
  AccountModel.create({
    ...req.body,
    //修改time属性的值
    time: moment(req.body.time).toDate()
  }).then((data) => {
    res.json({
      code: '0000',
      msg: '创建成功',
      data: data,
    })
  }).catch((err) => {
    res.json({
      code: '1002',
      msg: '创建失败',
      data: null,
    })
  })
})

//删除记录
router.delete('/account/:id', checkTokenMiddleware, (req, res, next) => {
  let id = req.params.id
  //删除
  AccountModel.deleteOne({ _id: id }).then((data) => {
    res.json({
      code: '0000',
      msg: '删除成功',
      data: null,
    })
  }).catch((err) => {
    res.json({
      code: '1003',
      msg: '删除失败',
      data: null,
    })
  })
});

//获取单个账单
router.get('/account/:id', checkTokenMiddleware, function (req, res, next) {
  //获取id参数
  let { id } = req.params
  console.log(req.user);
  //获取所有的账单信息
  AccountModel.findById(id).then((data) => {
    res.json({
      code: '0000',
      msg: '读取成功',
      data: data,
    })
  }).catch((err) => {
    res.json({
      code: '1004',
      msg: '读取失败',
      data: null,
    })
  })
});

//更新单个账单信息
router.patch('/account/:id', checkTokenMiddleware, (req, res, next) => {
  let { id } = req.params

  AccountModel.updateOne({ _id: id }, req.body).then((data) => {
    //再次查询数据库， 获取单条数据
    AccountModel.findById(id).then((data) => {
      res.json({
        code: '0000',
        msg: '更新成功',
        data: data,
      })
    }).catch((err) => {
      res.json({
        code: '1004',
        msg: '读取失败',
        data: null,
      })
    })
  }).catch((err) => {
    res.json({
      code: '1005',
      msg: '更新失败',
      data: null,
    })
  })
})

module.exports = router;
