exports.getJSONFile = function ( file ) {

   return JSON.parse( exports.getFileUTF8( file ) );
}


exports.getFileUTF8 = function ( file ) {
   var fs = require( 'fs' );
   var path = require( 'path' );

   return fs.readFileSync( file, 'utf8' );
}

exports.getAllJSONIn = function ( file ) {

   var out = [];
   var fs = require( 'fs' );
   var path = require( 'path' );
   var files = fs.readdirSync( file );
   var len = files.length;
   for (var i = 0; i < len; i++) {
      var filepath = path.join( file + files[i] );
      out.push( exports.getJSONFile( filepath ) )

   }

   return out;
}