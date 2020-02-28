const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('没有登录');

    // 校验token
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));// { _id: '5e57226784f4cf3494503b72', iat: 1582768743 }
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('错误的token.');
    }
}