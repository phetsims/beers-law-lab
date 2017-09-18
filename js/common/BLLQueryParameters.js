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
      defaultValue: BLLConstants.DEFAULT_CUVETTE_SNAP_INTERVAL,
      isValidValue: function( value ) {
        return value >= 0;
      }
    }
  } );

  beersLawLab.register( 'BLLQueryParameters', BLLQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( BLLQueryParameters, null, 2 ) );

  return BLLQueryParameters;
} );
