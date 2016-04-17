var http = require('http') ,
    parse = require('url').parse ,
    join = require('path').join ,
    fs = require('fs') ;
var root = __dirname ;

var server = http.createServer( function( req , res ){
    var url = parse( req.url ) ;
    var path = join( root , url.pathname ) ;
    console.log( path );
    fs.stat( path , function( err , stat ){
        console.log( arguments );
        if( err ){
            if( err.code == 'ENOENT' ){
                res.statusCode = 404 ;
                res.end( '404没有找到' ) ;
            }else{
                res.statusCode = 500 ;
                res.end( '500内部错误' ) ;
            }
        }else{
            res.setHeader( 'Content-Length' , stat.size ) ;
            var stream = fs.createReadStream( path ) ;
            stream.pipe( res ) ;
            stream.on( 'error' , function( err ){
                res.statusCode = 500 ;
                res.end( '500内部错误:stream读取错误' ) ;
            } ) ;
        }
    } ) ;
} ) ;

server.listen( 3000 ) ;