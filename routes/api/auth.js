const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const { secret } = require('../../config/config')

const UserModel = require('../../models/UserModel')
const md5 = require('md5')

//登录
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
      return res.json({
        code: '2002',
        msg: '账号或密码错误',
        data: null
      })
    }
    //创建当前用户的token
    let token = jwt.sign({
      username: data, username,
      _id: data._id,
    }, secret, {
      expiresIn: 60 * 60 * 24 * 7
    })
    //响应token
    res.json({
      code: '0000',
      msg: '登录成功',
      data: token
    })
  }).catch((err) => {
    res.json({
      code: '2001',
      msg: '数据库读取失败',
      data: null
    })
  })
})

router.post('/logout', (req, res) => {
  //销毁session
  req.session.destroy(() => {
    res.render('success', { msg: '退出登录成功', url: '/login' })
  })
})

module.exports = router;
