var connect = require('connect') ;

var router = require('./router') ;

var app = connect() ;

var routers = {
    GET: {
        '/users': function( req , res ){
            res.end( 'get uesrs' );
        } ,
        '/user/:id' : function( req , res , next , id ){
            res.end( 'get/user/:id = ' + id ) ;
        }
    } ,
    DELETE: {
        '/user/:id' : function( req , res , next , id ){
            res.end( 'deleted user = ' + id ) ;
        }
    }
}



app.use( router( routers ))
    .use( function( req , res ){
        res.end('404') ;
    }  )
    .listen(3000);