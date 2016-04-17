var http = require('http') ,
    parse = require('url').parse ,
    join = require('path').join ,
    fs = require('fs') ;
var root = __dirname ;

var server = http.createServer( function( req , res ){
    var url = parse( req.url ) ;
    var path = join( root , url.pathname ) ;
    var stream = fs.createReadStream( path ) ;
    stream.pipe( res ) ;
    stream.on( 'error' , function( err ){
        res.statusCode = 500 ;
        res.end( '服务器错误' ) ;
    } ) ;
} ) ;

server.listen( 3000 ) ;