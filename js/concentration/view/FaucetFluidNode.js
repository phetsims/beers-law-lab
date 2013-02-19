define(
  [
    "easel",
    "PHETCOMMON/model/Inheritance"
  ],
  function( Easel, Inheritance ) {

    /**
     * @param {Faucet} faucet
     * @param {Fluid} fluid
     * @param {ModelViewTransform2D} mvt
     * @param {Number} height in model coordinates
     * @constructor
     */
    function FaucetFluidNode( faucet, fluid, mvt, height ) {

      Easel.Shape.call( this ); // constructor stealing

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

    Inheritance.inheritPrototype( FaucetFluidNode, Easel.Shape ); // prototype chaining

    return FaucetFluidNode;

  }
);
