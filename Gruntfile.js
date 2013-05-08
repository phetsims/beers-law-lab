/*
 * beers-law-lab configuration file for Grunt.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
module.exports = function ( grunt ) {

  // Project configuration.
  grunt.initConfig(
      {
        pkg: '<json:package.json>',

        jshint: {
          files: [ 'js/**/*.js' ],
          options: {
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
        },

        requirejs: {
          production: {
            options: {
              almond: true,
              mainConfigFile: "js/beers-law-lab-config.js",
              out: "deploy/release/beers-law-lab.min.js",
              name: "beers-law-lab-config",
              optimize: 'uglify2'
            }
          }
        }

      } );

  // Register tasks
  grunt.registerTask( 'default', [ 'jshint', 'production' ] );

  // Compilation targets
  grunt.registerTask( 'production', [ 'requirejs:production' ] );

  // Load tasks
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
};