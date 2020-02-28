// Authentication Login认证
const Joi = require('joi'); //这个包已被废弃，但是可以用，只是不再开发了 这个项目移动到了@hapi/joi
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  // 重写认证函数
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // 寻找邮箱先,找到邮箱说明这个账户是存在的,找不到的话就账户不存在
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('账户不存在');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('错误的密码');
  // 生产token
  const token = user.generateAuthToken();
  // 发送token
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
