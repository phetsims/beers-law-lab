// Copyright 2013-2021, University of Colorado Boulder

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's output pipe.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import beersLawLab from '../../beersLawLab.js';
import Fluid from '../../common/model/Fluid.js';
import Faucet from '../model/Faucet.js';

class FaucetFluidNode extends Rectangle {

  /**
   * @param {Faucet} faucet
   * @param {Fluid} fluid
   * @param {number} height in model coordinates
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( faucet, fluid, height, modelViewTransform ) {
    assert && assert( faucet instanceof Faucet );
    assert && assert( fluid instanceof Fluid );
    assert && assert( typeof height === 'number' );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

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

beersLawLab.register( 'FaucetFluidNode', FaucetFluidNode );
export default FaucetFluidNode;