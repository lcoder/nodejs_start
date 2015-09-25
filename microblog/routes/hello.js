/**
 *
 * @authors supmain (mtingfeng@gmail.com)
 * @date    2015-09-25 22:01:17
 * @version $Id$
 */

var express = require('express') ;

var router = express.Router();

router.all("/",function(req,res,next){
    console.log(123123);
    next();
});

router.get("/",function(req,res,next){
    res.send("username: " + req.params.username );
});


module.exports = router ;

