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
  let user = localStorage.getItem('currentUser');
  if(user == null)
  {
    return redirect('/');
  }
  user = JSON.parse(user);
  res.render('create', { title: 'Create Food Recipe', user_id: user.id});
});

router.get('/:id',function(req, res, next){
  let id = req.params.id;
  console.log(req.session);
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
  let user = JSON.parse(localStorage.getItem('currentUser'));
  let createRecipe = {
    'name' : req.body.name,
    'ingredients': req.body.ingredients,
    'user_name': user.name,
    'user_id': user.id,
    'id': uuid
  };
  console.log(createRecipe);
  output.push(createRecipe);
  let user_recipe_lists = localStorage.getItem(user_id);
  let all_recipe = localStorage.getItem('allRecipe');
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
  return res.redirect('/users/recipe');
});

router.get('/edit/:id',function(req, res, next){
  let user = localStorage.getItem('currentUser');
  if(user == null)
  {
    return redirect('/');
  }
  let id = req.params.id;
  let lists = localStorage.getItem('allRecipe');
  if(lists == null)
  {
    res.redirect('/');
  }
  let data = JSON.parse(lists);
  let receipe_details = _.find(data, function (o) { return o.id == id; });
  console.log(receipe_details);
  res.render('edit', { title: 'Edit', data: receipe_details});

});

router.post('/edit',function(req, res,next){
  let id = req.body.id;
  let lists = localStorage.getItem('allRecipe');
  if(lists == null)
  {
    res.redirect('/');
  }
  let data = JSON.parse(lists);
  let receipe_details = _.find(data, function (o) { return o.id == id; });
  if(receipe_details)
  {
    receipe_details.name = req.body.name;
    receipe_details.ingredients = req.body.ingredients;
  }
  localStorage.setItem('allRecipe',JSON.stringify(data));
  res.redirect('/users/recipe');
});

router.delete('/:id',function(req,res,next){
  let user = localStorage.getItem('currentUser');
  if(user == null)
  {
    return redirect('/');
  }
  let idid = req.params.id;
  let lists = localStorage.getItem('allRecipe');
  if(lists == null)
  {
    res.redirect('/');
  }
  let data = JSON.parse(lists);
  let arr = _.without(data, _.findWhere(data, {
    id: id
  }));
  localStorage.setItem('allRecipe',JSON.stringify(arr));
  res.redirect('/users/recipe');
});


module.exports = router;
