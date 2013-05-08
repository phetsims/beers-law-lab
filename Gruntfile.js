/*
 * Configuration file for Grunt.
 * Used to configure or define tasks, and load Grunt plugins.
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
              $: true
            }
          }
        },

        requirejs: {
          compile: {
            options: {
              mainConfigFile: "js/beers-law-lab-config.js",
              out: "deploy/debug/beers-law-lab.debug.js",
              name: "beers-law-lab-config",
              wrap: true,
              uglify: {
                // turn off name mangling to make debugging easier
                no_mangle: true
              }
            }
          }
        },

        // Concatenate files.
        concat: {
          "deploy/debug/beers-law-lab.debug.js": [
            "lib/almond-0.2.5.js",
            "deploy/debug/beers-law-lab.debug.js"
          ]
        },

        // Minify files with UglifyJS.
        uglify: {
          "deploy/release/beers-law-lab.min.js": [
            "deploy/debug/beers-law-lab.debug.js"
          ]
        }
      } );

  // Register tasks
  grunt.registerTask( 'default', [ 'jshint', 'requirejs', 'concat', 'uglify'] );

  // Load tasks
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
};