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

  var BLLQueryParameters = {

    // {boolean} whether the solute amount (in grams) is visible on the Concentration screen, see beers-law-lab#148
    SOLUTE_AMOUNT_VISIBLE: !!getQueryParameter( 'soluteAmountVisible' ) || false,

    // {string} units on the concentration meter, 'molesPerLiter'|'percent', see beers-law-lab#149
    CONCENTRATION_METER_UNITS: getQueryParameter( 'concentrationMeterUnits' ) || 'molesPerLiter',

    // {string} units for beaker ticks, 'liters'|'milliliters', see beers-law-lab#150
    BEAKER_UNITS: getQueryParameter( 'beakerUnits' ) || 'liters'
  };

  // validation
  assert && assert( typeof BLLQueryParameters.SOLUTE_AMOUNT_VISIBLE === 'boolean' );
  assert && assert( BLLQueryParameters.CONCENTRATION_METER_UNITS === 'molesPerLiter' || BLLQueryParameters.CONCENTRATION_METER_UNITS === 'percent' );
  assert && assert( BLLQueryParameters.BEAKER_UNITS === 'liters' || BLLQueryParameters.BEAKER_UNITS === 'milliliters' );

  beersLawLab.register( 'BLLQueryParameters', BLLQueryParameters );

  return BLLQueryParameters;
} );
