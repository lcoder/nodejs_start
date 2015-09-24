

var http = require("http");
var querystring = require("querystring");
var util = require("util");

var server = new http.Server();

server.on("request",function(req,res){
    res.writeHead(200,{ "Content-type": "text/html" });
    console.log( req.url );
    if( req.url == "/" ){
        res.end( "<form action='/name' method='post'><input type='text' name='age'/><input type='submit'/></form>" );
        return false;
    };
    var post = '';
    req.on("data",function(chunk){
        post += chunk;
    });
    req.on("end",function(){
        post = querystring.parse( post );
        console.log( post );
        res.end( util.inspect(post) );
    });

});


server.listen(8080);


console.log("开始监听");




