/**
 * Created by maotingfeng on 16/3/12.
 */
var http = require("http") ;
var fs = require("fs") ;
var path = require("path") ;            // 文件系统路径相关
var mime = require("mime") ;
var cache = {} ;

var chatServer = require("./lib/chat_server") ;

var server = http.createServer( function( request , response ){
    var filePath = false ;
    if( request.url == '/' ){
        filePath = 'public/index.html';
    }else{
        filePath = 'public' + request.url ;
    }
    var absPath = './' + filePath ;

    serverStatic( response , cache , absPath ) ;

} ) ;

chatServer.listen( server ) ;

server.listen( 3000 , function(){
    console.log( "Server listening on port 3000" ) ;
} ) ;

// 404捕获
function send404( response ){
    response.writeHead( 404 , { "Content-Type": "text/plain" } ) ;
    response.write( "Error 404: 文件未找到" ) ;
    response.end() ;
}

// 根据文件设置mime类型
function sendFile( response , filePath , fileContents ){
    response.writeHead( 200 , {
        "Content-type" : mime.lookup( path.basename( filePath ) )
    } ) ;
    response.end( fileContents ) ;
}

// 缓存静态文件
function serverStatic( response , cache , absPath ){
    cache[absPath] = false;
    if( cache[absPath] ){   // 是否在缓存中
        sendFile( response , absPath , cache[absPath] ) ;
    }else{                  // 硬盘读取,判断是否存在
        fs.exists( absPath , function( exists ){
            if( exists ){
                fs.readFile( absPath , function( err , data ){
                    if( err ){
                        send404( response );
                    }else{
                        cache[ absPath ] = data ;
                        sendFile( response , absPath , data ) ;
                    }
                } ) ;
            }else{
                send404( response ) ;
            }
        } ) ;
    }
}

