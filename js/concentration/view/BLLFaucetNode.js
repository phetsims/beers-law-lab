// Copyright 2013-2021, University of Colorado Boulder

/**
 * Faucet node for this sim.
 * Handles scaling, and adapters our Faucet model to scenery-phet.FaucetNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import FaucetNode from '../../../../scenery-phet/js/FaucetNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import Faucet from '../model/Faucet.js';

// constants
const SCALE = 0.75;

class BLLFaucetNode extends FaucetNode {

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( faucet, modelViewTransform, options ) {
    assert && assert( faucet instanceof Faucet );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    const horizontalPipeLength = modelViewTransform.modelToViewX( faucet.position.x - faucet.pipeMinX ) / SCALE;

    options = merge( {
      horizontalPipeLength: horizontalPipeLength,
      scale: SCALE,
      shooterOptions: {
        touchAreaXDilation: 37,
        touchAreaYDilation: 60
      },
      tandem: Tandem.REQUIRED
    }, options );

    super( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, options );

    this.translation = modelViewTransform.modelToViewPosition( faucet.position );
  }
}

beersLawLab.register( 'BLLFaucetNode', BLLFaucetNode );
export default BLLFaucetNode;