// Copyright 2025-2026, University of Colorado Boulder

/**
 * SolventFaucetNode is the faucet for solvent (water).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BLLFaucetNode from './BLLFaucetNode.js';
import Faucet from '../model/Faucet.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';

export default class SolventFaucetNode extends BLLFaucetNode {

  public constructor( faucet: Faucet, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {
    super( faucet, modelViewTransform, {
      accessibleName: BeersLawLabStrings.a11y.solventFaucetNode.accessibleNameStringProperty,
      accessibleHelpText: BeersLawLabStrings.a11y.solventFaucetNode.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}
