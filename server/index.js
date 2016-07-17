var connect = require('connect') ,
    cookieParser = require('cookie-parser') ;

var app = connect() ;

function logger( format ){
    var regexp = /:(\w+)/ ;
    return function logger( req , res , next ){
        var str = format.replace( regexp , function( match , property ){
            console.log( arguments );
            return req[ property ] ;
        } ) ;
    }
}


app.use( logger( ':method :url' ) )
    .listen(3000);