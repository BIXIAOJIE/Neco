# Neco

> 一个基于 node.js 的后端服务器

## 开源目的

> 用于学习Node.js的 Authentication 和 Authorization,即授权和认证.主要在登录和注册模块中使用,同时我书写了两个中间件 

- admin.js 用户检测用户是否是管理员账户
- auth.js  用于检测用户是否是登录用户

# 使用 

- npm install 
- node index.js

## 使用的包

- joi : JavaScript最强大的模式描述语言和数据验证器。
- config: 存储环境变量
- jsonwebtoken
- mongoose
- fawn



## jsonwebtoken 使用指南

- 在user_model中封装generateAuthToken函数
    - jwt.sign({token里面包装的数据},"密钥",其他选项)
    - 当用户注或者登录成功之后 发送一个 res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    - 然后我们在一些比较隐私的操作中加入auth.js中间件
    - 这个中间件用于检查token是否存在的
        - const token = req.header('x-auth-token');
            - 如果token不存在,就返回此人没有登录
            - 如果存在,就校验他是否是正确的token
                - 如果是正确的token,那么才能进行下一步的操作

我们开发了auth中间件,这个中间件主要是用于对某些路由进行权限控制.

## 如何给model添加一个方法

> 案例:给 user_model 添加一个 generateAuthToken 方法,在处理post_user请求的时候,我们可以调用user.generateAuthToken() 得到一个 token,然后返回给注册/登录用户

```js
userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}
```

Schema.methods.methodsName = function(){} 

给Schema添加了方法之后,我们可以在routes里面进行