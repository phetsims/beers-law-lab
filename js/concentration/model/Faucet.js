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

    /**
     * @param {Point2D} location center of output pipe
     * @param {Number} inputPipeLength
     * @param {Number} maxFlowRate L/sec
     * @constructor
     */
    function Faucet( location, inputPipeLength, maxFlowRate ) {
      this.location = location;
      this.inputPipeLength = inputPipeLength;
      this.maxFlowRate = maxFlowRate;
      this.flowRate = new Property( 0 );
      this.enabled = new Property( true );
    }

    Faucet.prototype.reset = function () {
      this.flowRate.reset();
      this.enabled.reset();
    }

    return Faucet;
  } );

