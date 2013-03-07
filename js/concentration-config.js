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
        locale: "en_us"
      }
    },

    paths: {

      // contrib
      i18n: "../contrib/i18n-2.0.2",
      image: "../contrib/image-0.2.1",
      tpl: "../contrib/tpl-0.2",

      // Dependencies required by common repos
      stats: "../contrib/stats-r11",
      imagesloaded: "../contrib/jquery.imagesloaded-2.1.1",

      // Common repos, uppercase names to identify them in require imports
      ASSERT: '../../assert/js',
      DOT: '../../dot/js',
      PHETCOMMON: "../../phetcommon/js",
      SCENERY: '../../scenery/js'
    },

    shim: {
      jquery: { exports: "$" },
      stats: { exports: "Stats" }
    },

    urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts
  } );