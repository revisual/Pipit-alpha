buildJpgUrls = function ( data ) {

   var urls = [];
   var range = data.ranges[data.bookID];

   var start = range.split( "-" )[0];
   var end = range.split( "-" )[1];

   for (var i = start; i <= end; i++) {
      var url = data.url + data.projectID + "/" + data.bookID + "/" + data.size + "/" + pad( i, 5 ) + ".jpg";
      urls.push( url );
   }

   return urls;
};

function pad( num, size ) {
   var s = num + "";
   while (s.length < size) s = "0" + s;
   return s;
}

var toOptionInjector = {
   inject: function ( params ) {
      var len = this.data.length;
      for (var i = 0; i < len; i++) {
         this.data[i] = this.data[i].replace( /\$\{(.*)\}/g, function ( a, b ) {
            return params[b];
         } );

      }
   },
   data: ['public', 'data', 'images', '${name}']
};

var api = {
   project: function ( req, res ) {

      var buildFiles = require( "../scripts/utils/fs/file_access.js" );
      var filepath = path.join( __dirname, '../public' ) + '/json/projects.json';
      var data = buildFiles.getJSONFile( filepath );

      res.json( data );
   },

   book: function ( req, res ) {

      var path = require( "path" );
      var buildFiles = require( "../scripts/utils/fs/file_access.js" );

      var project = req.params.project;
      var book = req.params.book;
      var size = req.params.size;

      var filepath = path.join( __dirname, '../public' ) + '/json/' + project + '-info.json';
      var data = buildFiles.getJSONFile( filepath );

      data.projectID = project;
      data.bookID = book;
      data.size = size;
      data.url = process.env.IMAGE_END_POINT;

      data.urls = buildJpgUrls( data );

      res.json( data );
   }
};

module.exports = api;



