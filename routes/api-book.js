
exports.get = function ( req, res ) {

   var path = require( "path" );
   var buildFiles = require( "../scripts/utils/fs/file_access.js" );

   var project = req.params.project;
   var book = req.params.book;
   var size = req.params.size;

   var filepath = path.join( __dirname, '../public' ) + '/json/' + project + '-info.json';
   var data = buildFiles.getJSONFile( filepath );

   data.projectID = project;
   data.bookID = book;
   data.urls = buildFiles.getJpgUrls( project + "/" + book + "/" + size ) ;

   res.json( data );
}

