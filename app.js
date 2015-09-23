var fs = require("fs");

fs.readFile("index.txt","utf-8",function(err,data){
    if(err){
        console.error( err );
    }else {
        console.log("数据:"+data);
    }
});





