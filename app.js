

var EventEmitter = require("events").EventEmitter ;
var event = new EventEmitter();


event.on("some_event",function(){
    console.log( "some_event发生了" );
});



setTimeout(function(){
    event.emit("some_event");
},1000);