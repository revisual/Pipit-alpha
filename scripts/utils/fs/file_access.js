
exports.getJSONFile = function ( file ) {

   return JSON.parse( exports.getFileUTF8( file ) );
}


exports.getFileUTF8 = function ( file ) {
   var fs = require( 'fs' );
   var path = require( 'path' );

   return fs.readFileSync( file, 'utf8' );
}