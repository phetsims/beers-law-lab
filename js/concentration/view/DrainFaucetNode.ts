// Copyright 2025, University of Colorado Boulder

/**
 * DrainFaucetNode is the faucet for draining solution from the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BLLFaucetNode from './BLLFaucetNode.js';
import Faucet from '../model/Faucet.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';

export default class DrainFaucetNode extends BLLFaucetNode {

  public constructor( faucet: Faucet, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {
    super( faucet, modelViewTransform, {
      accessibleName: BeersLawLabStrings.a11y.drainFaucetNode.accessibleNameStringProperty,
      accessibleHelpText: BeersLawLabStrings.a11y.drainFaucetNode.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}

beersLawLab.register( 'DrainFaucetNode', DrainFaucetNode );