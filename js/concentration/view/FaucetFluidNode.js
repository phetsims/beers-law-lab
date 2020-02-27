// Copyright 2013-2020, University of Colorado Boulder

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
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class FaucetFluidNode extends Rectangle {

    /**
     * @param {Faucet} faucet
     * @param {Fluid} fluid
     * @param {number} height in model coordinates
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( faucet, fluid, height, modelViewTransform ) {

      super( 0, 0, 0, 0, { lineWidth: 1, pickable: false } );

      /*
       * Set the color of the fluid coming out of the spout.
       * @param {Color} color
       */
      fluid.colorProperty.link( color => {
        this.fill = color;
        this.stroke = color.darkerColor();
      } );

      /*
       * Set the width of the shape to match the flow rate.
       * @param {number} flowRate
       */
      const viewPosition = modelViewTransform.modelToViewPosition( faucet.position );
      const viewHeight = modelViewTransform.modelToViewDeltaY( height );
      faucet.flowRateProperty.link( flowRate => {
        if ( flowRate === 0 ) {
          this.setRect( 0, 0, 0, 0 );
        }
        else {
          const viewWidth = modelViewTransform.modelToViewDeltaX( faucet.spoutWidth * flowRate / faucet.maxFlowRate );
          this.setRect( viewPosition.x - ( viewWidth / 2 ), viewPosition.y, viewWidth, viewHeight );
        }
      } );
    }
  }

  return beersLawLab.register( 'FaucetFluidNode', FaucetFluidNode );
} );
