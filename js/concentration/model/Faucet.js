// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet model, used for input and output faucets.
 * This model assumes that the pipe enters the faucet from the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'beers-law-lab' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} location center of output pipe
   * @param {Number} pipeMinX x-coordinate of where the pipe starts
   * @param {Number} spoutWidth
   * @param {Number} maxFlowRate L/sec
   * @constructor
   */
  function Faucet( location, pipeMinX, spoutWidth, maxFlowRate ) {

    assert && assert( pipeMinX < location.x ); // pipe enters the faucet from the left

    var thisFaucet = this;

    thisFaucet.location = location;
    thisFaucet.pipeMinX = pipeMinX;
    thisFaucet.spoutWidth = spoutWidth;
    thisFaucet.maxFlowRate = maxFlowRate;
    thisFaucet.flowRate = new Property( 0 );
    thisFaucet.enabled = new Property( true );

    // when disabled, turn off the faucet.
    thisFaucet.enabled.link( function( enabled ) {
      if ( !enabled ) {
        thisFaucet.flowRate.set( 0 );
      }
    } );
  }

  Faucet.prototype = {
    reset: function() {
      this.flowRate.reset();
      this.enabled.reset();
    }
  };

  return Faucet;
} );

