// Copyright 2016-2017, University of Colorado Boulder

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

    // {boolean} whether the solute amount (in grams) is visible on the Concentration screen
    // This query parameter is intended for external use, see https://github.com/phetsims/beers-law-lab/issues/148
    showSoluteAmount: { type: 'flag' },

    // {string} units on the concentration meter
    // This query parameter is intended for external use, see https://github.com/phetsims/beers-law-lab/issues/149
    concentrationMeterUnits: {
      type: 'string',
      validValues: [ 'molesPerLiter', 'percent' ],
      defaultValue: 'molesPerLiter'
    },

    // {string} units for beaker ticks
    // This query parameter is intended for external use, see https://github.com/phetsims/beers-law-lab/issues/150
    beakerUnits: {
      type: 'string',
      validValues: [ 'liters', 'milliliters' ],
      defaultValue: 'liters'
    },

    // {number} snap interval for the cuvette in centimeters, or 0 for no snap
    // This query parameter is intended for external use, see https://github.com/phetsims/phet-io/issues/568
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
