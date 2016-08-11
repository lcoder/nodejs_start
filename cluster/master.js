/**
 *
 * @authors supmain (mtingfeng@gmail.com)
 * @date    2016-08-11 17:11:57
 * @version $Id$
 */

var cluster = require( 'cluster' ) ;

console.log( '主进程id:' + process.pid ) ;


cluster.fork() ;


process.on( 'SIGHUP' , function(){
    console.log( '重启' ) ;
    var new_worker = cluster.fork() ;
    new_worker.once( 'listening' , function(){
        for( var id in cluster.workers ){
            if( id === new_worker.id.toString() ) continue ;
            cluster.workers[ id ].kill( 'SIGTERM' ) ;
        }
    } ) ;
} )