/**
 *
 * @authors supmain (mtingfeng@gmail.com)
 * @date    2016-08-11 14:01:22
 * @version $Id$
 */
var http = require("http") ;
var cluster = require( 'cluster' ) ;

var os = require( 'os' ) ;


if( cluster.isMaster ){
    var numWorkers = os.cpus().length ;
    console.log( 'master进程建立：' + numWorkers + '个workers进程' ) ;
    for( var i = 0 ; i < numWorkers ; i += 1 ){
        var worker = cluster.fork() ;
        //worker.send( 'hi there' ) ;
    }
    cluster.on( 'online' , function( worker ){
        console.log( '子进程：' + worker.process.pid + '开始运行' ) ;
    } ) ;
    cluster.on( 'exit' , function( worker , code , signal ){
        console.log( '子进程：' + worker.process.pid + '退出，code：' + code + ',signal:' + signal  ) ;
        console.log( '生成一个新的进程，代替刚刚退出的进程' ) ;
        cluster.fork() ;
    } ) ;
    cluster.on( 'listening' , function( worker , address ){
        console.log( '一个子进程连接到了：' + address.address + ':port' + address.port ) ;
    } ) ;
    function eachWorker( callback ){
        for( var id in cluster.workers ){
            callback( cluster.workers[ id ] ) ;
        }
    }
    eachWorker( function( worker ){
        worker.send( '通知所有子进程' ) ;
    } ) ;
}else{
    process.on( 'message' , function( msg ){
        console.log( '子进程:'+ process.pid +'，收到消息:' + msg ) ;
    } ) ;
    //console.log( '子进程：'+ process.pid +',启动server:8000' );
    http.createServer( function( req , res ){
        console.log( '收到请求' ) ;
        res.writeHead( 200 ) ,
        res.end( 'hello world\n' ) ;
    } ).listen( 8000 ) ;
}