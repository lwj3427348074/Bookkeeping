const express = require('express');
const router = express.Router();

const UserModel = require('../../models/UserModel')
const md5 = require('md5')

//注册
router.get('/reg', (req, res, next) => {
  res.render('auth/reg')
})

router.post('/reg', (req, res, next) => {
  //做表单验证
  UserModel.create({
    ...req.body,
    password: md5(req.body.password)
  }).then((data) => {
    res.render('success', { msg: '注册成功', url: '/login' })
  }).catch(() => {
    res.status(500).send('注册失败，请稍后再试')
  })
})

//登录操作
router.get('/login', (req, res, next) => {
  res.render('auth/login')
})

router.post('/login', (req, res, next) => {
  let { username, password } = req.body
  //查询数据库
  UserModel.findOne({
    username: username,
    password: md5(password)
  }).then((data) => {
    if (!data) {
      return res.send('账号或密码输人错误')
    }
    //写入session
    req.session.username = data.username
    req.session._id = data._id

    res.render('success', { msg: '登录成功', url: '/account' })
  }).catch((err) => {
    console.log(err);
    res.status(500).send('登录失败，请稍后再试')
  })
})

router.post('/logout', (req, res) => {
  //销毁session
  req.session.destroy(() => {
    res.render('success', { msg: '退出登录成功', url: '/login' })
  })
})

module.exports = router;
