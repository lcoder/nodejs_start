

var http = require("http");


var server = new http.Server();

server.on("request",function(req,res){

    console.log(req.complete);
    console.log( req.httpVersion );
    console.log( req.method );
    console.log( req.url );
    console.log( req.headers );
    console.log( req.trailers );
    //console.log( req.connection );
    //console.log( req.socket );
    //console.log( req.client );
    res.writeHead(200,{ "Content-type": "text/html" });
    res.write("<h1>maotingfeng</h2>");
    res.end("hello world");
});


server.listen(8080);


console.log("开始监听");




