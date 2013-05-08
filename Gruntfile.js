/**
 * beers-law-lab configuration file for Grunt.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
module.exports = function( grunt ) {

  // Project configuration.
  grunt.initConfig(
      {
        pkg: '<json:package.json>',

        //TODO factor out project name, then we could use the same Gruntfile.js for all sims
        requirejs: {
          production: {
            options: {
              almond: true,
              mainConfigFile: "js/beers-law-lab-config.js",
              out: "deploy/beers-law-lab.min.js",
              name: "beers-law-lab-config",
              optimize: 'uglify2'
            }
          }
        },

        jshint: {
          // source files that are specific to this simulation
          simFiles: [ '*.js', 'js/**/*.js' ],
          // source files from common-code dependencies
          commonFiles: [
//            '../assert/js/**/*.js',
//            '../dot/js/**/*.js',
//            '../fort/js/**/*.js',
//            '../joist/js/**/*.js',
//            '../kite/js/**/*.js',
//            '../phet-core/js/**/*.js',
            '../phetcommon/js/**/*.js',
//            '../scenery/js/**/*.js',
//            '../scenery-phet/js/**/*.js',
//            '../sun/js/**/*.js',
//            '../Watch.JS/src/**/*.js'
          ],
          options: {
            // enforcing options
            curly: true, // brackets for conditionals
            eqeqeq: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            // noempty: true,
            nonew: true,
            // quotmark: 'single',
            undef: true,
            // unused: true, // certain layer APIs not used in cases
            // strict: true,

            // relaxing options
            es5: true, // we use ES5 getters and setters for now
            loopfunc: true, // we know how not to shoot ourselves in the foot, and this is useful for _.each

            expr: true, // so we can use assert && assert( ... )

            globals: {
              // for removal of assertions
              sceneryAssert: true,
              sceneryExtraAssert: true,

              // for logging levels
              sceneryLayerLog: true,
              sceneryEventLog: true,

              // for require.js
              define: true,
              require: true,

              Uint16Array: false,
              Uint32Array: false,
              document: false,
              window: false,
              console: false,
              Float32Array: true, // we actually polyfill this, so allow it to be set

              HTMLImageElement: false,
              HTMLCanvasElement: false,

              $: false,
              _: false,
              clearTimeout: false,

              // for DOM.js
              Image: false,
              Blob: false,

              canvg: false
            }
          }
        }
      } );

  // Default task ('grunt')
  grunt.registerTask( 'default', [ 'lint', 'production' ] ); //TODO default should be [ 'lint', 'lint-common', 'production' ]

  // Other tasks ('grunt taskName')
  grunt.registerTask( 'lint', [ 'jshint:simFiles' ] );
  grunt.registerTask( 'lint-common', [ 'jshint:commonFiles' ] ); //TODO requires standardizing jshint options
  grunt.registerTask( 'production', [ 'requirejs:production' ] );

  // Load tasks from grunt plugins that have been installed locally using npm.
  // Put these in package.json and run 'npm install' before running grunt.
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
};