// Copyright 2002-2013, University of Colorado

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's output pipe.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define(
  [
    "KITE/Shape",
    "SCENERY/nodes/Path",
    "PHETCOMMON/util/Inheritance"
  ],
  function ( Shape, Path, Inheritance ) {
    "use strict";

    /**
     * @param {Faucet} faucet
     * @param {Fluid} fluid
     * @param {Number} height in model coordinates
     * @param {ModelViewTransform2D} mvt
     * @constructor
     */
    function FaucetFluidNode( faucet, fluid, height, mvt) {

      Path.call( this ); // constructor stealing

      var faucetFluidNode = this;

      this.x = faucet.location.x;
      this.y = faucet.location.y;

      /*
       * Set the color of the fluid coming out of the spout.
       * @param {Color} color
       */
      fluid.colorProperty.addObserver( function ( color ) {
        console.log( color );//XXX
        faucetFluidNode.fill = "red";//color.toCSS(); //TODO
      } );

      /*
       * Set the width of the shape to match the flow rate.
       * @param {Number} flowRate
       */
      faucet.flowRateProperty.addObserver( function ( flowRate ) {
        if ( flowRate == 0 ) {
          faucetFluidNode.shape = new Shape();
        }
        else {
          var viewWidth = mvt.modelToView( faucet.spoutWidth * flowRate / faucet.maxFlowRate );
          var viewHeight = mvt.modelToView( height );
          faucetFluidNode.shape = Shape.rect( -viewWidth / 2, 0, viewWidth, viewHeight );
        }
      } );
    }

    Inheritance.inheritPrototype( FaucetFluidNode, Path ); // prototype chaining

    return FaucetFluidNode;

  }
);
