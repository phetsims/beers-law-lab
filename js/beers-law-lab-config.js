// Copyright 2002-2013, University of Colorado

/*
 * RequireJS configuration file for the "Concentration" sim.
 * Paths are relative to the location of this file.
 *
 * @author Chris Malley
 */

// if has.js is included, set assertion flags to false, to improve performance.
if ( window.has ) {
  window.has.add( 'assert.dot', function( global, document, anElement ) {
    return false;
  } );
  window.has.add( 'assert.kite', function( global, document, anElement ) {
    return false;
  } );
  window.has.add( 'assert.kite.extra', function( global, document, anElement ) {
    return false;
  } );
  window.has.add( 'assert.scenery', function( global, document, anElement ) {
    return false;
  } );
  window.has.add( 'assert.scenery.extra', function( global, document, anElement ) {
    return false;
  } );
}

requirejs.config(
  {
    deps: ["beers-law-lab-main"],

    config: {
      i18n: {
        locale: "en_us"
      }
    },

    paths: {

      // third-party libs
      i18n: "../lib/i18n-2.0.2",
      image: "../lib/image-0.2.1", //TODO replace with ImagesLoaded
      imagesloaded: "../lib/jquery.imagesloaded-2.1.1",

      // PhET libs, uppercase names to identify them in require.js imports
      ASSERT: '../../assert/js',
      DOT: '../../dot/js',
      PHET_CORE: '../../phet-core/js',
      PHETCOMMON: "../../phetcommon/js",
      SCENERY: '../../scenery/js',
      KITE: '../../kite/js',
      SCENERY_PHET: '../../scenery-phet/js',
      FORT: '../../fort/js',
      SUN: '../../sun/js',
      JOIST: '../../joist/js'
    },

    shim: {
      jquery: { exports: "$" },
    },

    //TODO remove this before deploy
    urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts
  } );
