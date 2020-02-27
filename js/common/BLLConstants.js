// Copyright 2014-2020, University of Colorado Boulder

/**
 * Constants that are global to this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants used to compute other constants
  const BEAKER_VOLUME = 1;// L

  const BLLConstants = {
    SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) },
    RADIO_BUTTON_RADIUS: 11,
    SOLUTE_AMOUNT_RANGE: new RangeWithValue( 0, 7, 0 ), // moles
    SOLUTION_VOLUME_RANGE: new RangeWithValue( 0, BEAKER_VOLUME, 0.5 ), // liters
    BEAKER_VOLUME: BEAKER_VOLUME,
    DEFAULT_CUVETTE_SNAP_INTERVAL: 0.1, // cm
    CONCENTRATION_SCREEN_TANDEM: Tandem.ROOT.createTandem( 'concentrationScreen' ),
    BEERS_LAW_SCREEN_TANDEM: Tandem.ROOT.createTandem( 'beersLawScreen' )
  };

  return beersLawLab.register( 'BLLConstants', BLLConstants );
} );
