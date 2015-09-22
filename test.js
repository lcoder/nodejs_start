/**
 *
 * @authors mtingfeng (mtingfeng@gmail.com)
 * @date    2015-03-17 16:20:19
 * @version $Id$
 */
 var http = require('http') ,
    fs = require("fs");

var buffer = new Buffer("韩京华"),
    han = new Buffer( [0xe9 , 0x9f , 0xa9 , 0xe4 , 0xba , 0xac , 0xe5 , 0x8d , 0x8e ] );
console.log( buffer );
console.log( buffer.toString() );
console.log( han.toString() )