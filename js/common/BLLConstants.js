// Copyright 2014-2017, University of Colorado Boulder

/**
 * Constants that are global to this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Tandem = require( 'TANDEM/Tandem' );

  // constants used to compute other constants
  var BEAKER_VOLUME = 1;// L

  var BLLConstants = {
    SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) },
    RADIO_BUTTON_RADIUS: 11,
    SOLUTE_AMOUNT_RANGE: new RangeWithValue( 0, 7, 0 ), // moles
    SOLUTION_VOLUME_RANGE: new RangeWithValue( 0, BEAKER_VOLUME, 0.5 ), // liters
    BEAKER_VOLUME: BEAKER_VOLUME,
    DEFAULT_CUVETTE_SNAP_INTERVAL: 0.1, // cm
    CONCENTRATION_SCREEN_TANDEM: Tandem.createStaticTandem( 'concentrationScreen' ),
    BEERS_LAW_SCREEN_TANDEM: Tandem.createStaticTandem( 'beersLawScreen' )
  };

  beersLawLab.register( 'BLLConstants', BLLConstants );

  return BLLConstants;
} );
