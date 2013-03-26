// Copyright 2002-2013, University of Colorado

/**
 * Faucet model, used for input and output faucets.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Property = require( "PHETCOMMON/model/property/Property" );

  /**
   * @param {Vector2} location center of output pipe
   * @param {Number} spoutWidth
   * @param {Number} pipeLength
   * @param {Number} maxFlowRate L/sec
   * @constructor
   */
  function Faucet( location, spoutWidth, pipeLength, maxFlowRate ) {

    var thisFaucet = this;

    thisFaucet.location = location;
    thisFaucet.spoutWidth = spoutWidth;
    thisFaucet.pipeLength = pipeLength;
    thisFaucet.maxFlowRate = maxFlowRate;
    thisFaucet.flowRate = new Property( 0 );
    thisFaucet.enabled = new Property( true );

    // when disabled, turn off the faucet.
    thisFaucet.enabled.addObserver( function ( enabled ) {
      if ( !enabled ) {
        thisFaucet.flowRate.set( 0 );
      }
    } );
  }

  Faucet.prototype.reset = function () {
    this.flowRate.reset();
    this.enabled.reset();
  };

  return Faucet;
} );

