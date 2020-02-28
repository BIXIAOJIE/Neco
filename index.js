const config = require('config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

// if(!config.get(jwtPrivateKey)){
//   console.log('致命错误:没有定义jwtPrivateKey');
//   process.exit(1)  
// }

// 链接到数据库
mongoose.connect('mongodb://localhost/vidly',{useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex: true})
  .then(() => console.log('数据库连接成功'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/customers', customers); 
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`web服务器启动成功`));