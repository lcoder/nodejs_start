var fs = require( 'fs' ) ;
var path = require( 'path' ) ;
var args = process.argv.splice( 2 ) ;
var command = args.shift() ;
var taskDescription = args.join( ' ' ) ;
var file = path.join( process.cwd() , '/.tasks' ) ;

switch( command ) {
    case 'list':
        listTasks( file ) ;
        break;
    case 'add':
        addTask( file , taskDescription ) ;
        break;
    default:
        console.log( '控制台的正确使用方法' + process.argv[0] );
        break;
}

function loadOrInitializeTaskArray( file , cb ){
    fs.exists( file , function( exists ){
        var tasks = [] ;
        if( exists ){
            fs.readFile( file , 'utf8' , function( err , data ){
                if( err ) throw err ;
                var data = data.toString() ;
                var tasks = JSON.parse( data || '[]' ) ;
                cb( tasks ) ;
            } ) ;
        }else{
            cb( [] ) ;
        }
    } ) ;
}
function storeTasks( file , tasks ){
    fs.writeFile( file , JSON.stringify( tasks ) , function( err ){
        if( err ) throw err ;
        console.log('保存成功！');
    } ) ;
}

function listTasks( file ){
    loadOrInitializeTaskArray( file , function( tasks ){
        for( var i in tasks ){
            console.log( tasks[ i ] ) ;
        }
    } ) ;
}

function addTask( file , taskDescription ){
    loadOrInitializeTaskArray( file , function( tasks ){
        tasks.push( taskDescription ) ;
        storeTasks( file , tasks ) ;
    } )
}
