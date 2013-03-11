// Copyright 2002-2013, University of Colorado

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's output pipe.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define(
  [
    "SCENERY/nodes/Path",
    "PHETCOMMON/util/Inheritance"
  ],
  function( Path, Inheritance ) {
    "use strict";

    /**
     * @param {Faucet} faucet
     * @param {Fluid} fluid
     * @param {ModelViewTransform2D} mvt
     * @param {Number} height in model coordinates
     * @constructor
     */
    function FaucetFluidNode( faucet, fluid, mvt, height ) {

      Path.call( this ); // constructor stealing

      /*
       * Set the color of the fluid coming out of the spout.
       * @param {Color} color
       */
      fluid.colorProperty.addObserver( function ( color ) {
        //TODO set fill and stroke color
      } );

      /*
       * Set the width of the shape to match the flow rate.
       * @param {Number} flowRate
       */
      faucet.flowRateProperty.addObserver( function ( flowRate ) {
        if ( flowRate == 0 ) {
          //TODO set shape to null
        }
        else {
          var width = faucet.spoutWidth * flowRate / faucet.maxFlowRate;
          //TODO set width of shape
        }
      } );
    }

    Inheritance.inheritPrototype( FaucetFluidNode, Path ); // prototype chaining

    return FaucetFluidNode;

  }
);
