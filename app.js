

var fs = require("fs");


var success = function(err,data){
    if( err ){
        console.log(err);
    }else {
        console.log( data );
    }
};

var data = fs.readFileSync("index.txt",'utf-8');

console.log( data );

console.log("end");
