/**
 * Created by maotingfeng on 16/3/12.
 */
var socketio = require("socket.io") ;
var io ;
var guestNumber = 1 ;
var nickNames = {} ;
var namesUsed = [] ;
var currentRoom = {} ;

// 分配昵称
function assignGuestName( socket , guestNumber , nickNames , namesUsed ){
    var name = 'Guest' + guestNumber ;
    nickNames[ socket.id ] = name ;
    socket.emit('nameResult',{
        success: true ,
        name: name
    }) ;
    namesUsed.push( name ) ;
    return guestNumber + 1 ;
}
// 进入聊天室
function joinRoom( socket , room ){
    socket.join( room ) ;
    currentRoom[ socket.id ] = room ;
    socket.emit( "joinResult" , { room: room } ) ;  // 通知用户加入房间
    socket.broadcast.to( room ).emit( "message" , {
        text: nickNames[ socket.id ] + 'has joined' + room + '.'
    } ) ;
    // 聊天室里都有谁?
    var usersInRoom = io.sockets.clients( room ) ;
    if( usersInRoom.length > 1 ){
        var usersInRoomSummary = 'Users currently in ' + room + ':';
        for( var index in usersInRoom ){
            var userSocketId = usersInRoom[ index].id ;
            if( userSocketId != socket.id ){
                if( index > 0 ){
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[ userSocketId ] ;
            }
        }
        usersInRoomSummary += '.';
        socket.emit( "message" , { text: usersInRoomSummary } ) ;
    }
}
// 修改昵称
function handleNameChangeAttempts( socket , nickNames , namesUsed ){
    socket.on( "nameAttempt" , function( name ){
        if( name.indexOf('Guest') == 0 ){
            socket.emit( 'nameResult' , {
                success: false ,
                message: 'Names cannot begin with "Guest".'
            } ) ;
        }else{
            if( namesUsed.indexOf( name ) == -1 ){
                var previousName = nickNames[ socket.id ];
                var previousNameIndex = namesUsed.indexOf( previousName ) ;
                namesUsed.push( name );
                nickNames[ socket.id ] = name ;
                delete namesUsed[ previousNameIndex ] ;
                socket.emit('nameResult',{
                    success: true ,
                    name: name
                }) ;
                socket.broadcast.to( currentRoom[ socket.id ]).emit("message",{
                    text: previousName + 'is now known as' + name + '.'
                }) ;
            }else{
                // 昵称被占用
                socket.emit( "nameResult" , {
                    success: false ,
                    message: 'that name is already in use.'
                } ) ;
            }
        }
    } ) ;
}
// 发送聊天消息
function handleMessageBroadcasting( socket ){
    socket.on( "message" , function( message ){
        socket.broadcast.to( message.room).emit('message',{
            text: nickNames[ socket.id ] + ': ' + message.text
        }) ;
    } ) ;
}
// 创建房间
function handleRoomJoining( socket ){
    socket.on("join",function(room){
        console.log( "房间名:" + room.newRoom );
        socket.leave( currentRoom[ socket.id ] ) ;
        joinRoom( socket , room.newRoom ) ;
    }) ;
}
// 断开连接
function handleClientDisconnection( socket ){
    socket.on( "disconnect" , function(){
        var nameIndex = namesUsed.indexOf( nickNames[ socket.id ] ) ;
        delete namesUsed[ nameIndex ] ;
        delete nickNames[ socket.id ];
    } ) ;
}

exports.listen = function ( server ) {
    io = socketio.listen( server ) ;    // 启动socket io服务器,搭载在已有的http服务器上

    io.set( "log level" , 1 ) ;

    io.sockets.on( "connection" , function( socket ){

        console.log("新建连接");
        guestNumber = assignGuestName( socket , guestNumber , nickNames , namesUsed ) ;

        joinRoom( socket , 'Lobby' ) ;

        handleMessageBroadcasting( socket , nickNames );

        handleNameChangeAttempts( socket , nickNames , namesUsed ) ;

        handleRoomJoining( socket ) ;

        socket.on( "rooms" , function(){
            socket.emit('rooms' , io.sockets.manager.rooms ) ;
        } ) ;

        handleClientDisconnection( socket , nickNames , namesUsed ) ;

    } ) ;

}