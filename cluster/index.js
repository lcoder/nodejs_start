/**
 *
 * @authors supmain (mtingfeng@gmail.com)
 * @date    2016-08-11 14:01:22
 * @version $Id$
 */
var http = require("http") ;
var cluster = require( 'cluster' ) ;


if( cluster.isMaster ){
    require( './master' ) ;
    return ;
}


http.createServer( function( req , res ){
    res.writeHead(200);
    res.end('hello world\n') ;
} ).listen(8000,function(){
    console.log( 'http://localhost:8080' );
});