// Copyright 2013-2023, University of Colorado Boulder

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

export default class FaucetFluidNode extends Rectangle {

  public constructor( faucet: Faucet, fluid: Fluid, height: number, modelViewTransform: ModelViewTransform2 ) {

    super( 0, 0, 0, 0, {
      isDisposable: false,
      lineWidth: 1,
      pickable: false
    } );

    // Set the color of the fluid coming out of the spout.
    fluid.colorProperty.link( color => {
      this.fill = color;
      this.stroke = color.darkerColor();
    } );

    // Set the width of the shape to match the flow rate.
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