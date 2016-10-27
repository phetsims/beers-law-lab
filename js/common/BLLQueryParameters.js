// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );

  var BLLQueryParameters = QueryStringMachine.getAll( {

    // {boolean} whether the solute amount (in grams) is visible on the Concentration screen, see beers-law-lab#148
    showSoluteAmount: { type: 'flag' },

    // {string} units on the concentration meter, see beers-law-lab#149
    concentrationMeterUnits: {
      type: 'string',
      validValues: [ 'molesPerLiter', 'percent' ],
      defaultValue: 'molesPerLiter'
    },

    // {string} units for beaker ticks, see beers-law-lab#150
    beakerUnits: {
      type: 'string',
      validValues: [ 'liters', 'milliliters' ],
      defaultValue: 'liters'
    },

    // {number} snap interval for the cuvette in centimeters, or 0 for no snap
    cuvetteSnapInterval: {
      type: 'number',
      defaultValue: BLLConstants.DEFAULT_CUVETTE_SNAP_INTERVAL
    }
  } );

  // validation - use Error instead of assert, because these are user errors, not programming errors
  if ( BLLQueryParameters.cuvetteSnapInterval < 0 ) {
    throw new Error( 'cuvetteSnapInterval must be >= 0: ' + BLLQueryParameters.cuvetteSnapInterval );
  }

  beersLawLab.register( 'BLLQueryParameters', BLLQueryParameters );

  return BLLQueryParameters;
} );
