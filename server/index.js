var http = require('http') ;
var formidable = require('formidable') ;

var server = http.createServer( function( req , res ){
    switch( req.method ) {
        case 'GET':
            show( req , res ) ;
            break;
        case 'POST':
            upload( req , res ) ;
            break;
        default:
            console.log( '错误请求' ) ;
    }
} ) ;

// 上传表单
function show( req , res ){
    var html = '<html><head><title>文件上传</title></head><body>'
        + '<h1>上传区域</h1>'
        + '<form action="/" method="post" enctype="multipart/form-data">'
        + '<p><input type="text" name="name" /></p>'
        + '<p><input type="file" name="file" /></p>'
        + '<p><input type="submit" value="上传" /></p>'
        + '</form>'
        + '</body>'
        + '</html>' ;
    res.setHeader( 'Content-Type' , 'text/html' ) ;
    res.setHeader( 'Content-Length' , Buffer.byteLength( html ) ) ;
    res.end( html ) ;
}

function isFormData( req ){
    var type = req.headers[ 'content-type' ] || '' ;
    return 0 == type.indexOf( 'multipart/form-data' ) ;
}

function upload( req , res ){
    if( !isFormData( req ) ){
        res.statusCode = 400 ;
        res.end('错误请求，必须为multipart/form-data请求类型') ;
    }
    var form = new formidable.IncomingForm() ;
    /*form.on( 'field' , function( field , value ){
        console.log( field );
        console.log( value );
    } ) ;
    form.on( 'file' , function( name , file ){
        console.log( name );
        console.log( file );
    } ) ;
    form.on( 'end' , function( ){
        res.end( '上传完成' ) ;
    } ) ;*/
    form.on( 'progress' , function( bytesReceived , bytesExpected ){
        var percent = Math.floor( bytesReceived / bytesExpected * 100 ) ;
        console.log( percent ) ;
    } ) ;
    form.parse( req , function( err , fields , files ){
        console.log( fields ) ;
        console.log( files ) ;
        res.end( 'upload complete' ) ;
    } ) ;
}


server.listen( 3000 ) ;