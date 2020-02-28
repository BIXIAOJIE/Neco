module.exports = function (req, res, next) { 
    // 401 Unauthorized
    // 403 Forbidden 
    // 
    // 为什么req里面会有user对象
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');
    next();
  }