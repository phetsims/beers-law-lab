// Copyright 2002-2013, University of Colorado

/*
 * RequireJS configuration file for the "Beer's Law Lab" sim.
 * Paths are relative to the location of this file.
 *
 * @author Chris Malley
 */
require.config(
  {
    deps: ["beers-law-lab-main"],

    paths: {
      // contrib
      easel: "../contrib/easeljs-0.6.0.min",
      i18n: "../contrib/i18n-2.0.2",
      image: "../contrib/image-0.2.1",
      tpl: "../contrib/tpl-0.2",

      // common directories, uppercase names to identify them in require imports
      PHETCOMMON: "../common/phetcommon/js",
      'EASEL-PHET': "../common/easel-phet/js"
    },

    shim: {
      easel: {
        exports: "createjs"
      }
    },

    urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts
  } );