

var http = require("http");
var url = require("url");
var util = require("util");

var server = new http.Server();

server.on("request",function(req,res){

    res.writeHead(200,{ "Content-type": "text/html" });
    res.end( util.inspect( url.parse(req.url , true) ) );
    console.log( url.parse(req.url , true).query.mao );
});


server.listen(8080);


console.log("开始监听");




