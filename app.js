

var hello = require("./hello") ;

console.log( process.argv )




process.stdin.resume();


process.stdin.on("data",function(data){
    process.stdout.write( "console:" + data.toString() );
});