var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport'),
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

const app = express();

passport.use(new GoogleStrategy({
  clientID: '1093471803296-ijtc9g86pa8hhe3nfh6qrhhsd5iv5fn2.apps.googleusercontent.com',
  clientSecret: 'bZ00BXuHIpD6t4iTbgVTOuRj',
  callbackURL: "https://quiet-cliffs-72534.herokuapp.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  cb(null,profile);
}
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'ssshhhhh',
  // create new redis store.
  saveUninitialized: false,
  resave: false
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.id = req.user.id;
    req.session.username = req.user.name;
    let user = {
      'id': req.user.id,
      'name': req.user.displayName
    };
    localStorage.setItem('currentUser',JSON.stringify(user));
    res.redirect('/users/recipe');
  });

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
