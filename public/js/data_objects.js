ImageListLoader = function () {

   var Signal = signals.Signal;

   this.on = {progress: new Signal(), complete: new Signal(), firstResolved: new Signal()}

   this.images = []
   this.numberLoadedImages = 0;
   this.totalNumberImages = 0;

   var _files = [];
   var _filesWorking = [];

   var _errors = [];
   var _that = this;

   this.getImage = function () {
      return new Image();
   };

   this.add = function ( url ) {

      var type = typeof url;
      if (type === "string") {
         _files.push( url );

      }

      else if (type === "object") {
         if (url instanceof Array) {
            _files = _files.concat( url );
         }
      }

      this.totalNumberImages = _files.length;
   };

   this.start = function () {
      _filesWorking = _files.slice();
      loadNext();
   };

   this.resetWith = function ( url ) {
      this.reset();
      this.add( url );
   };

   this.reset = function () {
      _filesWorking.length = 0;
      _files.length = 0;
      _that.images.length = 0;
      _errors.length = 0;
   }

   function loadNext() {

      var image = _that.getImage();

      var onload = function () {
         handleImageResult( image );
      }

      var onerror = function ( error ) {

         if (_errors === undefined) {
            _errors = [error];
         }
         else {
            _errors.push( error );
         }

         handleImageResult( image );
      }

      image.onload = onload;
      image.onerror = onerror;
      image.src = _filesWorking.pop();
      _that.images.push( image );
   }

   function handleImageResult( image ) {
      image.onload = null;
      image.onerror = null;

      _that.numberLoadedImages = _that.images.length;

      if (_that.numberLoadedImages === 1) {
         _that.on.firstResolved.dispatch( _that.numberLoadedImages );
      }

      _that.on.progress.dispatch( _that.numberLoadedImages, _that.totalNumberImages );

      if (_filesWorking.length === 0) {
         _that.on.complete.dispatch();
      }

      else if (_filesWorking.length > 0) {
         loadNext();
      }
   }


}

PageData = function ( imageList ) {

   var _pageNumber = 1;
   var _imageList = imageList;
   this.on = _imageList.on;

   this.getTotalLoadedPages = function () {
      return _imageList.numberLoadedImages;
   };

   this.getTotalPages = function () {
      return _imageList.totalNumberImages;
   };

   this.getWidth = function () {
      if (_imageList.images.length === 0)return 0;
      return _imageList.images[_pageNumber - 1].width;
   };

   this.getHeight = function () {
      if (_imageList.images.length === 0)return 0;
      return _imageList.images[_pageNumber - 1].height;
   };

   this.getPageNumber = function () {
      return _pageNumber
   };

   this.setPageNumber = function ( value ) {
      _pageNumber = Math.max( 1, Math.min( value, _imageList.images.length ) );
   };


   this.getCurrentImage = function () {
      if (_imageList.images.length === 0)return new Image();
      return _imageList.images[_pageNumber - 1];
   }

   this.load = function ( urls ) {
      ;
      _imageList.resetWith( urls );
      _imageList.start();
   }


}

ElementMap = function () {

   var _that = this;
   var _map = {};

   this.onElementAdded = null;

   this.add = function ( element ) {
      return new ElementMapping( element );
   }

   this.for = function ( name ) {
      return new ElementMapping( _map[name] );
   }

   this.has = function ( name ) {
      return ( _map[name] != undefined && _map[name] != undefined );
   }

   this.remove = function ( name ) {
      delete _map[name]
   }

   ElementMapping = function ( element ) {

      this.with = function ( name ) {
         _map[name] = element;
         if (_that.onElementAdded !== null) {
            _that.onElementAdded( name, element );
         }
      }

      this.get = function ( name ) {
         if (element === null || element === undefined) return undefined;
         return element[name];
      }

      this.set = function ( name, value ) {
         if (element === null || element === undefined) return;
         element[name] = value;
      }

      this.setCSS = function ( name, value ) {
         if (element === null || element === undefined) return;
         element.style[name] = value;
      }

      this.call = function ( name, args ) {
         if (element === null || element === undefined) return undefined;
         return element[name].apply( undefined, args );
      }

   }


}

