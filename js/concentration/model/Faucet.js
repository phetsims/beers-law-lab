// Copyright 2013-2020, University of Colorado Boulder

/**
 * Faucet model, used for input and output faucets.
 * This model assumes that the pipe enters the faucet from the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  class Faucet {

    /**
     * @param {Vector2} position center of output pipe
     * @param {number} pipeMinX x-coordinate of where the pipe starts
     * @param {number} spoutWidth
     * @param {number} maxFlowRate L/sec
     * @param {Tandem} tandem
     */
    constructor( position, pipeMinX, spoutWidth, maxFlowRate, tandem ) {

      assert && assert( pipeMinX < position.x ); // pipe enters the faucet from the left

      // @public (read-only)
      this.position = position;
      this.pipeMinX = pipeMinX;
      this.spoutWidth = spoutWidth;
      this.maxFlowRate = maxFlowRate;

      // @public
      this.flowRateProperty = new NumberProperty( 0, {
        tandem: tandem.createTandem( 'flowRateProperty' ),
        units: 'liters/second'
      } );
      this.enabledProperty = new BooleanProperty( true );

      // when disabled, turn off the faucet.
      this.enabledProperty.link( enabled => {
        if ( !enabled ) {
          this.flowRateProperty.set( 0 );
        }
      } );
    }

    // @public
    reset() {
      this.flowRateProperty.reset();
      this.enabledProperty.reset();
    }
  }

  return beersLawLab.register( 'Faucet', Faucet );
} );

