
exports.getJpgUrls = function ( path ) {
   var fs = require( 'fs' );

   path = 'images/' + path + '/'
   var names = fs.readdirSync( 'public/' + path );

   var len = names.length;
   var urls = [];
   for (var i = 0; i < len; i++) {
      var name = names[i];
      var split = name.split( '.' );
      var ext = split[split.length - 1].toLowerCase()
      if (ext === "jpg" || ext === "jpeg") {
         urls.push( path + name );
      }

   }
   return urls;
}
exports.getJSONFile = function ( file ) {

   return JSON.parse( exports.getFileUTF8( file ) );
}


exports.getFileUTF8 = function ( file ) {
   var fs = require( 'fs' );
   var path = require('path');

   return fs.readFileSync( file, 'utf8' );
}