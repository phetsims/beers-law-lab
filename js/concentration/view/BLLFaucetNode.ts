// Copyright 2013-2022, University of Colorado Boulder

/**
 * Faucet node for this sim.
 * Handles scaling, and adapters our Faucet model to scenery-phet.FaucetNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import FaucetNode, { FaucetNodeOptions } from '../../../../scenery-phet/js/FaucetNode.js';
import beersLawLab from '../../beersLawLab.js';
import Faucet from '../model/Faucet.js';

// constants
const SCALE = 0.75;

type SelfOptions = EmptySelfOptions;

type BLLFaucetNodeOptions = SelfOptions & PickRequired<FaucetNodeOptions, 'tandem'>;

export default class BLLFaucetNode extends FaucetNode {

  public constructor( faucet: Faucet, modelViewTransform: ModelViewTransform2, providedOptions: BLLFaucetNodeOptions ) {

    const horizontalPipeLength = modelViewTransform.modelToViewX( faucet.position.x - faucet.pipeMinX ) / SCALE;

    const options = optionize<BLLFaucetNodeOptions, SelfOptions, FaucetNodeOptions>()( {

      // FaucetNodeOptions
      horizontalPipeLength: horizontalPipeLength,
      scale: SCALE,
      shooterOptions: {
        touchAreaXDilation: 37,
        touchAreaYDilation: 60
      }
    }, providedOptions );

    super( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, options );

    this.translation = modelViewTransform.modelToViewPosition( faucet.position );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'BLLFaucetNode', BLLFaucetNode );