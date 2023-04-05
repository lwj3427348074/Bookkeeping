/**
 * 连接数据库的模块
 * @param {*} success 数据库连接成功的回调
 * @param {*} error 数据库连接失败的回调
 */
module.exports = function (success, error) {

  //判断error 为其设置默认值
  if (typeof error !== 'function') {
    error = () => {
      console.log('连接失败');
    }
  }

  const mongoose = require('mongoose')

  //导入配置文件
  const { DBHOST, DBPORT, DBNAME } = require('../config/config')

  //连接mongodb服务
  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`)

  mongoose.connection.once('open', () => {
    success();
  })
  //连接失败的回调
  mongoose.connection.on('error', () => {
    error();
  })
  //连接关闭的回调
  mongoose.connection.on('close', () => {
    console.log('连接关闭');
  })

}