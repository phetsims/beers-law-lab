// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main entry point for the 'Beer's Law Lab' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeersLawScreen = require( 'BEERS_LAW_LAB/beerslaw/BeersLawScreen' );
  var ConcentrationScreen = require( 'BEERS_LAW_LAB/concentration/ConcentrationScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var beersLawLabTitleString = require( 'string!BEERS_LAW_LAB/beers-law-lab.title' );

  // constants
  var tandem = new Tandem( 'beersLawLab' );

  var simOptions = {
    credits: {
      leadDesign: 'Julia Chamberlain',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Kelly Lancaster, Emily B. Moore, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Elise Morgan,\nOliver Orejola, Benjamin Roberts, Bryan Yoelin',
      thanks: 'Conversion of this simulation to HTML5 was funded by the Royal Society of Chemistry.'
    },
    tandem: tandem
  };

  console.log( 0 === null );

  SimLauncher.launch( function() {
    var sim = new Sim( beersLawLabTitleString, [
      new ConcentrationScreen( tandem.createTandem( 'concentrationScreen' ) ),
      new BeersLawScreen( tandem.createTandem( 'beersLawScreen' ) )
    ], simOptions );
    sim.start();
  } );
} );