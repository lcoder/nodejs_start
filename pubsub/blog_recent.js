var events = require('events')
    , net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id, client) {
    this.clients[id] = client ;
    this.subscriptions[id] = function(senderId, message) {
        if (id != senderId) {
            this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscriptions[id] );
});

channel.on( 'leave' , function( id ){
    channel.removeListener( 'broadcast' , this.subscriptions[id] );
    channel.emit( 'broadcast' , id , id + '已经断开连接' );
} )

channel.on( 'shutdown' , function(  ){
    channel.emit( 'broadcast' , '' , '聊天已关闭' );
    channel.removeAllListeners('broadcast');
} ) ;

var server = net.createServer(function (client) {
    var id = client.remoteAddress + ':' + client.remotePort;

    channel.emit('join', id, client);

    client.on('data', function(data) {
        data = data.toString();
        if( data == "shutdown\r\n" ){
            channel.emit('shutdown');
        }
        channel.emit('broadcast', id, data);
    });
    // 关闭客户端
    client.on('close',function(){
        channel.emit('leave', id);
    })
});
server.listen(3000);
