var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//set up config, db variables
const config = require('./config');
const MongoClient = require('mongodb').MongoClient;  //create mongo client
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//create mongo connection
MongoClient.connect(`mongodb://${config.dbHost}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(client => {
    const db = client.db(config.dbHost);
    const collection = db.collection(config.dbCollection);
    app.locals[config.dbCollection] = collection; //Assigning the collection to local
   })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Middleware - to make the collection easily available for our root
app.use(cors());   //get network errors

app.use((req, res, next) => {
  const collection = req.app.locals[config.dbCollection];
  req.collection = collection;
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
