// Copyright 2002-2013, University of Colorado

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's output pipe.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Shape = require( "KITE/Shape" );
  var Path = require( "SCENERY/nodes/Path" );
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );

  /**
   * @param {Faucet} faucet
   * @param {Fluid} fluid
   * @param {Number} height in model coordinates
   * @param {ModelViewTransform2D} mvt
   * @constructor
   */
  function FaucetFluidNode( faucet, fluid, height, mvt ) {

    var thisNode = this;
    Path.call( thisNode, {
      lineWidth: 1  //TODO is this correct?
    } );

    this.x = faucet.location.x;
    this.y = faucet.location.y;

    /*
     * Set the color of the fluid coming out of the spout.
     * @param {Color} color
     */
    fluid.color.addObserver( function ( color ) {
      thisNode.fill = color.toCSS();
      thisNode.stroke = color.darker().toCSS();
    } );

    /*
     * Set the width of the shape to match the flow rate.
     * @param {Number} flowRate
     */
    faucet.flowRate.addObserver( function ( flowRate ) {
      if ( flowRate == 0 ) {
        thisNode.shape = new Shape();
      }
      else {
        var viewWidth = mvt.modelToView( faucet.spoutWidth * flowRate / faucet.maxFlowRate );
        var viewHeight = mvt.modelToView( height );
        thisNode.shape = Shape.rect( -viewWidth / 2, 0, viewWidth, viewHeight );
      }
    } );
  }

  Inheritance.inheritPrototype( FaucetFluidNode, Path ); // prototype chaining

  return FaucetFluidNode;

} );
