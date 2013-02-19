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
     * @param {Number} pipeLength
     * @param {Number} maxFlowRate L/sec
     * @constructor
     */
    function Faucet( location, spoutWidth, pipeLength, maxFlowRate ) {
      this.location = location;
      this.spoutWidth = spoutWidth;
      this.pipeLength = pipeLength;
      this.maxFlowRate = maxFlowRate;
      this.flowRateProperty = new Property( 0 );
      this.enabledProperty = new Property( true );
    }

    Faucet.prototype.reset = function () {
      this.flowRateProperty.reset();
      this.enabledProperty.reset();
    }

    return Faucet;
  } );

