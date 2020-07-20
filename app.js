var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var uuid = require('uuid')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tbRouter = require('./routes/transbank');
var transRouter = require('./routes/tb');
var session = require('express-session')
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    genid: (req) => {
      console.log('Inside the session middleware')
      console.log(req.sessionID)
      return uuid() // use UUIDs for session IDs
    },
    secret: 'gusigusiGagaga',
    resave: false,
    saveUninitialized: true
  }))

app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/transbank', tbRouter);
app.use('/tb', transRouter);


app.listen(8000);

module.exports = app;
