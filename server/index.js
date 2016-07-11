var connect = require('connect') ;
var app = connect() ;

// 访问
// curl --user maotingfeng:123 localhost:3000/admin/users
function logger( req , res , next ){
    console.log( "%s %s" , req.method , req.url ) ;
    next() ;
}

function hello( req , res , next ){
    res.setHeader( 'Content-Type' , 'text/plain' ) ;
    res.end( 'hello world' ) ;
}

function restrict( req , res , next ){
    var authorization = req.headers.authorization ;

    if( !authorization ) { return next( new Error('未认证') ) ; }

    var parts = authorization.split( ' ' ) ,
        scheme = parts[0] ,
        auth = new Buffer( parts[1] , 'base64' ).toString().split( ':' ) ,
        user = auth[0] ,
        pass = auth[1] ;
    console.log( new Buffer( parts[1] , 'base64' ).toString() );
    if( user == 'maotingfeng' ){
        next()
    }else{
        next( new Error('用户名错误') ) ;
    }

}

function admin( req , res , next ){
    switch(req.url) {
        case '/':
            res.end( '请访问/users' ) ;
            break;
        case '/users':
            res.setHeader( 'Content-Type' , 'application/json' ) ;
            res.end( JSON.stringify( [ 'maotingfeng' , 'wangjunhui' ] ) ) ;
            break;
    }
}

app.use( logger )
    .use( '/admin' , restrict )
    .use( '/admin' , admin )
    .use( hello )
    .listen( 3000 ) ;
