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
  var BeersLawLabAPI = require( 'PHET_IO/api/beers-law-lab-api' );
  var Solute = require( 'BEERS_LAW_LAB/concentration/model/Solute' );
  var BeersLawSolution = require( 'BEERS_LAW_LAB/beerslaw/model/BeersLawSolution' );
  var phetio = require( 'PHET_IO/phetio' );
  var SimIFrameAPI = require( 'PHET_IO/SimIFrameAPI' );

  // strings
  var beersLawLabTitleString = require( 'string!BEERS_LAW_LAB/beers-law-lab.title' );

  // constants
  var tandem = Tandem.createRootTandem();
  phetio.api = BeersLawLabAPI;
  new Tandem( 'phetio' ).addInstance( phetio );

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

  window.phetLaunchSimulation = function() {
    SimLauncher.launch( function() {
      Solute.initStatic( tandem.createTandem( 'solutes' ) );
      BeersLawSolution.initStatic( tandem.createTandem( 'solutions' ) );
      var sim = new Sim( beersLawLabTitleString, [
        new ConcentrationScreen( tandem.createTandem( 'concentrationScreen' ) ),
        new BeersLawScreen( tandem.createTandem( 'beersLawScreen' ) )
      ], simOptions );
      sim.start();
    } );
  };
  SimIFrameAPI.initialize();
  if ( phet.chipper.getQueryParameter( 'phet-io.standalone' ) ) {
    window.phetLaunchSimulation();
  }
} );