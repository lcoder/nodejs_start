var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// routes.user
router.get('/u/:user',function(req,res,next){
    res.send("data："+ req.params.user );
});

// routes.post
router.post('/post',function(req,res,next){

});

// routes.reg
router.get('/reg',function(req,res,next){

});

// routes.doReg
router.post('/reg',function(req,res,next){

});

// routes.login
router.get('/login',function(req,res,next){

});

// routes.doLogin
router.post('/doLogin',function(req,res,next){

});

// routes.logout
router.post('/logout',function(req,res,next){

});


module.exports = router;
