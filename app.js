var http = require("http");

http.createServer(function(req,res){
    res.writeHead(200,{"Content-type":"text/html"});
    res.write("<h1>nodejs3</h1>");
    res.end("<p>hello world2</p>");
}).listen(8080);
console.log("启动了")