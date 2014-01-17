MockImageList = function () {

   this.images = [];
   var _that = this;

   this.add = function ( url ) {
      _that.images.push( {src: url} );
   }


}
