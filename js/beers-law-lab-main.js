// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Beer's Law Lab' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require( [ 'JOIST/SimLauncher', 'JOIST/Sim', 'BEERS_LAW_LAB/concentration/ConcentrationScreen', 'BEERS_LAW_LAB/beerslaw/BeersLawScreen',
  'string!BEERS_LAW_LAB/beers-law-lab.name'],
  function( SimLauncher, Sim, ConcentrationScreen, BeersLawScreen, titleString ) {
    'use strict';

    //TODO i18n, see joist#66
    var simOptions = {
      credits: 'PhET Development Team -\n' +
               'Lead Design: Julia Chamberlain\n' +
               'Software Development: Chris Malley\n' +
               'Design Team: Kelly Lancaster, Emily B. Moore, Ariel Paul, Kathy Perkins',
      thanks: 'Thanks -\n' +
              'Conversion of this simulation to HTML5 was funded by the Royal Society of Chemistry.'
    };

    // Appending '?dev' to the URL will enable developer-only features.
    if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
      simOptions = _.extend( {
        // add dev-specific options here
        showHomeScreen: false,
        screenIndex: 0
      }, simOptions );
    }

    SimLauncher.launch( function() {
      var sim = new Sim( titleString, [ new ConcentrationScreen(), new BeersLawScreen() ], simOptions );
      sim.start();
    } );
  } );
