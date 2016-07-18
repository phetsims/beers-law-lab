// Copyright 2014-2015, University of Colorado Boulder

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

  var BLLConstants = {
    SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) },
    RADIO_BUTTON_RADIUS: 11,
    SOLUTE_AMOUNT_RANGE: new RangeWithValue( 0, 7, 0 ) // moles
  };

  beersLawLab.register( 'BLLConstants', BLLConstants );

  return BLLConstants;
} );
