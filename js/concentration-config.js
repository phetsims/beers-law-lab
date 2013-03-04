// Copyright 2002-2013, University of Colorado

/*
 * RequireJS configuration file for the "Concentration" sim.
 * Paths are relative to the location of this file.
 *
 * @author Chris Malley
 */
requirejs.config(
  {
    deps: ["concentration-main"],

    config: {
      i18n: {
        locale: window.phetLocale
      }
    },

    paths: {
      // contrib
      easel: "../contrib/easeljs-0.6.0.min",
      i18n: "../contrib/i18n-2.0.2",
      image: "../contrib/image-0.2.1",
      tpl: "../contrib/tpl-0.2",

      // common directories, uppercase names to identify them in require imports
      PHETCOMMON: "../common/phetcommon/js",
      'EASEL-PHET': "../common/easel-phet/js",

      // Scenery and its dependencies
      ASSERT: '../../scenery/common/assert/js',
      DOT: '../../scenery/common/dot/js',
      SCENERY: '../../scenery/js'
    },

    shim: {
      easel: { exports: "createjs" },
      underscore: { exports: "_" },
      jquery: { exports: "$" }
    },

    urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts
  } );