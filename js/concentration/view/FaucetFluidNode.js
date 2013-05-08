// Copyright 2002-2013, University of Colorado

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's output pipe.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Path = require( "SCENERY/nodes/Path" );
  var Shape = require( "KITE/Shape" );

  /**
   * @param {Faucet} faucet
   * @param {Fluid} fluid
   * @param {Number} height in model coordinates
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function FaucetFluidNode( faucet, fluid, height, mvt ) {

    var thisNode = this;
    Path.call( thisNode, { lineWidth: 1 } );

    /*
     * Set the color of the fluid coming out of the spout.
     * @param {Color} color
     */
    fluid.color.addObserver( function( color ) {
      thisNode.fill = color.toCSS();
      thisNode.stroke = color.darker().toCSS();
    } );

    /*
     * Set the width of the shape to match the flow rate.
     * @param {Number} flowRate
     */
    var viewLocation = mvt.modelToViewPosition( faucet.location );
    var viewHeight = mvt.modelToViewDeltaY( height );
    faucet.flowRate.addObserver( function( flowRate ) {
      if ( flowRate === 0 ) {
        thisNode.shape = new Shape();
      }
      else {
        var viewWidth = mvt.modelToViewDeltaX( faucet.spoutWidth * flowRate / faucet.maxFlowRate );
        thisNode.shape = Shape.rect( viewLocation.x - (viewWidth / 2), viewLocation.y, viewWidth, viewHeight );
      }
    } );
  }

  inherit( FaucetFluidNode, Path );

  return FaucetFluidNode;

} );
