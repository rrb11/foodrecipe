var express = require('express');
var router = express.Router();
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = JSON.parse(localStorage.getItem('currentUser'));
  if(!user){
    user = null;
  }
  res.render('index', { title: 'Express', data: user });
});

router.get('/logout', (req, res) => {
  let user = JSON.parse(localStorage.getItem('currentUser'));
  // localStorage.removeItem(user.id);
  localStorage.removeItem('currentUser');
  req.logout();
  req.session = null;
  res.redirect('/');
});

module.exports = router;
