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

    var faucet = this;

    faucet.location = location;
    faucet.spoutWidth = spoutWidth;
    faucet.pipeLength = pipeLength;
    faucet.maxFlowRate = maxFlowRate;
    faucet.flowRate = new Property( 0 );
    faucet.enabled = new Property( true );

    // when disabled, turn off the faucet.
    faucet.enabled.addObserver( function ( enabled ) {
      if ( !enabled ) {
        faucet.flowRate.set( 0 );
      }
    } );
  }

  Faucet.prototype.reset = function () {
    this.flowRate.reset();
    this.enabled.reset();
  };

  return Faucet;
} );

