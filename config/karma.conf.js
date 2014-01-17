module.exports = function ( config ) {
   config.set( {
      basePath: '../',
      frameworks: ['jasmine'],
      files: [
         'public/lib/angular/angular.js',
         'public/lib/angular/angular-*.js',
         'test/lib/angular/angular-mocks.js',
         'public/js/*.js',
         'test/unit/*.js'
      ],
      autoWatch: true,
      browsers: ['Chrome'],
      junitReporter: {
         outputFile: 'test_out/unit.xml',
         suite: 'unit'
      }
   } )
}