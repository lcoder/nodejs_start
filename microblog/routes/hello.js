/**
 *
 * @authors supmain (mtingfeng@gmail.com)
 * @date    2015-09-25 22:01:17
 * @version $Id$
 */

var express = require('express') ;

var router = express.Router();


router.get("/",function(req,res,next){
    res.send("time: " + new Date().toString() );
});


module.exports = router ;

