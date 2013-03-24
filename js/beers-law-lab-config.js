// Copyright 2002-2013, University of Colorado

/*
 * RequireJS configuration file for the "Concentration" sim.
 * Paths are relative to the location of this file.
 *
 * @author Chris Malley
 */
requirejs.config(
  {
    deps: ["beers-law-lab-main"],

    config: {
      i18n: {
        locale: "en_us"
      }
    },

    paths: {

      // contrib
      i18n: "../contrib/i18n-2.0.2",
      image: "../contrib/image-0.2.1", //TODO replace with ImagesLoaded
      tpl: "../contrib/tpl-0.2",
      bootstrap: "../contrib/bootstrap-2.3.0/js/bootstrap",

      // Dependencies required by common repos
      stats: "../contrib/stats-r11",
      imagesloaded: "../contrib/jquery.imagesloaded-2.1.1",

      // Common repos, uppercase names to identify them in require imports
      ASSERT: '../../assert/js',
      DOT: '../../dot/js',
      PHET_CORE: '../../phet-core/js',
      PHETCOMMON: "../../phetcommon/js",
      SCENERY: '../../scenery/js',
      KITE: '../../kite/js'
    },

    shim: {
      jquery: { exports: "$" },
      stats: { exports: "Stats" }
    },

    //TODO remove this before deploy
    urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts
  } );
