var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport'),
GoogleStrategy = require('passport-google-oauth20').Strategy;
const localStorage = require('localStorage');


passport.use(new GoogleStrategy({
  clientID: '1093471803296-ijtc9g86pa8hhe3nfh6qrhhsd5iv5fn2.apps.googleusercontent.com',
  clientSecret: 'bZ00BXuHIpD6t4iTbgVTOuRj',
  callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  // if(localStorage.getItem(data.id))
  //   {
  //     return cb(null, JSON.parse(localStorage.getItem(data.id)));
  //   } else {
  //       let information = {
  //           'name': profile.displayName,
  //       };
  //       localStorage.setItem(profile.id,JSON.stringify(information));
  //       return cb(null, information);
  //   }
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

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
    res.redirect('/');
  });

  app.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
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
