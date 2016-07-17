var connect = require('connect') ,
    cookieParser = require('cookie-parser') ;

var app = connect() ;


app.use( cookieParser('tobi is a cool ferret') )
    .use( function(req,res) {
        console.log( req.cookies )
        console.log( req.signedCookies );
        res.setHeader( 'Set-Cookie' , 'name=maotingfeng' ) ;
        res.end('hello world\n') ;
    } )
    .listen(3000);