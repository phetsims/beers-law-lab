// Copyright 2002-2013, University of Colorado Boulder

/*
 * RequireJS configuration file for the 'Beer's Law Lab' sim.
 * Paths are relative to the location of this file.
 *
 * @author Chris Malley
 */

require.config( {

  deps: ['beers-law-lab-main'],

  config: {
    i18n: {
      locale: 'en_us'
    }
  },

  paths: {

    // third-party libs
    i18n: '../../sherpa/i18n-2.0.4',

    // PhET libs, uppercase names to identify them in require.js imports
    ASSERT: '../../assert/js',
    AXON: '../../axon/js',
    DOT: '../../dot/js',
    JOIST: '../../joist/js',
    KITE: '../../kite/js',
    NITROGLYCERIN: '../../nitroglycerin/js',
    PHET_CORE: '../../phet-core/js',
    PHETCOMMON: '../../phetcommon/js',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    SUN: '../../sun/js',

    // this sim
    BEERS_LAW_LAB: "."
  },

  urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts
} );
