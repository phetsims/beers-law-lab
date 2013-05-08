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
            '../assert/js/**/*.js',
            '../dot/js/**/*.js',
            '../fort/js/**/*.js',
            '../joist/js/**/*.js',
            '../kite/js/**/*.js',
            '../phet-core/js/**/*.js',
            '../phetcommon/js/**/*.js',
            '../scenery/js/**/*.js',
            '../scenery-phet/js/**/*.js',
            '../sun/js/**/*.js',
            '../Watch.JS/src/**/*.js'
          ],
          options: {
            // options documented at http://www.jshint.com/docs/
            curly: true,
            eqeqeq: true,
            immed: false,
            latedef: false,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            boss: true,
            eqnull: true,
            browser: true,
            node: true,
            jquery: true,
            expr: true,
            globals: {
              Modernizr: true,
              define: true,
              $: true,
              _: true
            }
          }
        }

      } );

  // Default task
  grunt.registerTask( 'default', [ 'lint', 'production' ] ); //TODO default should do lint-common before production

  // Other tasks
  grunt.registerTask( 'lint', [ 'jshint:simFiles' ] );
  grunt.registerTask( 'lint-common', [ 'jshint:commonFiles' ] ); //TODO requires standardizing jshint options
  grunt.registerTask( 'production', [ 'requirejs:production' ] );

  // Load tasks
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
};