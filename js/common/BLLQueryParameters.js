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

  var getQueryParameter = phet.chipper.getQueryParameter;

  // constants - valid values, 0th element is the default
  var CONCENTRATION_METER_UNITS_VALUES = [ 'molesPerLiter', 'percent' ];
  var BEAKER_TICK_UNITS_VALUES = [ 'liters', 'milliliters' ];

  var BLLQueryParameters = {

    // {boolean} whether the solute amount (in grams) is visible on the Concentration screen, see beers-law-lab#148
    SOLUTE_AMOUNT_VISIBLE: !!getQueryParameter( 'soluteAmountVisible' ) || false,

    // {string} units on the concentration meter, 'molesPerLiter'|'percent', see beers-law-lab#149
    CONCENTRATION_METER_UNITS: getQueryParameter( 'concentrationMeterUnits' ) || CONCENTRATION_METER_UNITS_VALUES[ 0 ],

    // {string} units for beaker ticks, 'liters'|'milliliters', see beers-law-lab#150
    BEAKER_UNITS: getQueryParameter( 'beakerUnits' ) || BEAKER_TICK_UNITS_VALUES[ 0 ]
  };

  // validation - use Error instead of assert, because these are user errors, not programming errors
  if ( typeof BLLQueryParameters.SOLUTE_AMOUNT_VISIBLE !== 'boolean' ) {
    throw new Error( 'invalid value for soluteAmountVisible query parameter: ' + BLLQueryParameters.SOLUTE_AMOUNT_VISIBLE );
  }
  if ( _.indexOf( CONCENTRATION_METER_UNITS_VALUES, BLLQueryParameters.CONCENTRATION_METER_UNITS ) === -1 ) {
    throw new Error( 'invalid value for concentrationMeterUnits query parameter: ' + BLLQueryParameters.CONCENTRATION_METER_UNITS );
  }
  if ( _.indexOf( BEAKER_TICK_UNITS_VALUES, BLLQueryParameters.BEAKER_UNITS ) === -1 ) {
    throw new Error( 'invalid value for beakerUnits query parameter: ' + BLLQueryParameters.BEAKER_UNITS );
  }

  beersLawLab.register( 'BLLQueryParameters', BLLQueryParameters );

  return BLLQueryParameters;
} );
