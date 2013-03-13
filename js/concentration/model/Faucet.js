// Copyright 2002-2013, University of Colorado

/**
 * Faucet model, used for input and output faucets.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define(
  [
    "PHETCOMMON/model/property/Property"
  ],
  function ( Property ) {
    "use strict";

    /**
     * @param {Vector2} location center of output pipe
     * @param {Number} spoutWidth
     * @param {Number} pipeLength
     * @param {Number} maxFlowRate L/sec
     * @constructor
     */
    function Faucet( location, spoutWidth, pipeLength, maxFlowRate ) {
      this.location = location;
      this.spoutWidth = spoutWidth;
      this.pipeLength = pipeLength;
      this.maxFlowRate = maxFlowRate;
      this.flowRate = new Property( 0 );
      this.enabled = new Property( true );

      // when disabled, turn off the faucet.
      this.enabled.addObserver( function (enabled ) {
        if ( !enabled ) {
          this.flowRate.set( 0 );
        }
      } );
    }

    Faucet.prototype.reset = function () {
      this.flowRate.reset();
      this.enabled.reset();
    };

    return Faucet;
  } );

