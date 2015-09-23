var events = require("events");


var emitter = new events.EventEmitter();

var a = null
emitter.on("someEvent",function( arg1 , arg2 ){
    a = arguments.callee ;
    console.log(arg1,arg2);
});



emitter.emit("someEvent","byvoid",1991);



a(1,2)