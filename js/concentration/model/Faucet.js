// Copyright 2013-2015, University of Colorado Boulder

/**
 * Faucet model, used for input and output faucets.
 * This model assumes that the pipe enters the faucet from the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * @param {Vector2} location center of output pipe
   * @param {number} pipeMinX x-coordinate of where the pipe starts
   * @param {number} spoutWidth
   * @param {number} maxFlowRate L/sec
   * @param {Tandem} tandem
   * @constructor
   */
  function Faucet( location, pipeMinX, spoutWidth, maxFlowRate, tandem ) {

    assert && assert( pipeMinX < location.x ); // pipe enters the faucet from the left

    var thisFaucet = this;

    // @public (read-only)
    thisFaucet.location = location;
    thisFaucet.pipeMinX = pipeMinX;
    thisFaucet.spoutWidth = spoutWidth;
    thisFaucet.maxFlowRate = maxFlowRate;

    // @public
    thisFaucet.flowRateProperty = new Property( 0, {
      tandem: tandem.createTandem( 'flowRateProperty' ),
      type: TNumber( 'liters/second' )
    } );
    thisFaucet.enabledProperty = new Property( true );

    // when disabled, turn off the faucet.
    thisFaucet.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        thisFaucet.flowRateProperty.set( 0 );
      }
    } );
  }

  beersLawLab.register( 'Faucet', Faucet );

  return inherit( Object, Faucet, {

    // @public
    reset: function() {
      this.flowRateProperty.reset();
      this.enabledProperty.reset();
    }
  } );
} );

