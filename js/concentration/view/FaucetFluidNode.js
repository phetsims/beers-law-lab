// Copyright 2013-2017, University of Colorado Boulder

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's output pipe.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Faucet} faucet
   * @param {Fluid} fluid
   * @param {number} height in model coordinates
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function FaucetFluidNode( faucet, fluid, height, modelViewTransform ) {

    var self = this;

    Rectangle.call( this, 0, 0, 0, 0, { lineWidth: 1, pickable: false } );

    /*
     * Set the color of the fluid coming out of the spout.
     * @param {Color} color
     */
    fluid.colorProperty.link( function( color ) {
      self.fill = color;
      self.stroke = color.darkerColor();
    } );

    /*
     * Set the width of the shape to match the flow rate.
     * @param {number} flowRate
     */
    var viewLocation = modelViewTransform.modelToViewPosition( faucet.location );
    var viewHeight = modelViewTransform.modelToViewDeltaY( height );
    faucet.flowRateProperty.link( function( flowRate ) {
      if ( flowRate === 0 ) {
        self.setRect( 0, 0, 0, 0 );
      }
      else {
        var viewWidth = modelViewTransform.modelToViewDeltaX( faucet.spoutWidth * flowRate / faucet.maxFlowRate );
        self.setRect( viewLocation.x - (viewWidth / 2), viewLocation.y, viewWidth, viewHeight );
      }
    } );
  }

  beersLawLab.register( 'FaucetFluidNode', FaucetFluidNode );

  return inherit( Rectangle, FaucetFluidNode );
} );
