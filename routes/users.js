var express = require('express');
var router = express.Router();
_ = require('underscore');
const uuidv1 = require('uuid/v1');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/recipe',function(req,res,next){
  let lists = localStorage.getItem('allRecipe');
  if(lists != null)
  {
    lists = JSON.parse(lists);
  } else {
    lists = null;
  }
  res.render('recipe', { title: 'Express',data: lists});
});

router.get('/create',function(req, res, next){
  res.send('A');
});

router.get('/:id',function(req, res, next){
  let id = req.params.id;
  let lists = localStorage.getItem('allRecipe');
  if(lists == null)
  {
    res.redirect('/');
  }
  let data = JSON.parse(lists);
  let receipe_details = _.find(data, function (o) { return o.id == id; });
  res.render('view', { title: 'View', data: receipe_details});
});

router.post('/create',function(req, res, next){
  let user_id = req.body.user_id;
  let uuid = uuidv1();
  let output = [];
  let createRecipe = {
    'name' : req.body.name,
    'ingredients': req.body.ingredients,
    'user_name': user_id,
    'id': uuid
  };
  output.push(createRecipe);
  let user_recipe_lists = localStorage.getItem(user_id);
  let all_recipe = localStorage.getItem('allRecipe'); console.log(all_recipe);
  if(all_recipe == null)
  {
    localStorage.setItem('allRecipe',JSON.stringify(output));
  } else {
      let lists = JSON.parse(all_recipe);
      lists.push(createRecipe);
      localStorage.setItem('allRecipe',JSON.stringify(lists));
  }
  if(user_recipe_lists == null)
  {
    localStorage.setItem(user_id,JSON.stringify(output));
  } else {
      let  recipeLists = JSON.parse(user_recipe_lists);
      recipeLists.push(createRecipe);
      localStorage.setItem(user_id,JSON.stringify(recipeLists));
  }
  res.json(JSON.parse(localStorage.getItem('allRecipe')));
});


module.exports = router;
