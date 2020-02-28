const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken'); // 导入 token 引入token机制
const config = require('config');
const bcrypt = require('bcrypt'); // 导入 bcrypt 引入加密机制
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// 注册逻辑
router.post('/', async (req, res) => {
  // 针对req.body的json数据进行数据校验，这里的数据校验是在models内部的user.js中定义并导出的 
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  // 诊断重复的email 如果email是重复的,那么一定能够查询到user所以
  // if(user)是true的话,那么 res.status(400).send('User already registered.');
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('用户已经注册过了');
  // 使用lodash来pick一个数据,以下是文档
  // https://www.lodashjs.com/docs/latest#_pickobject-props
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router; 
