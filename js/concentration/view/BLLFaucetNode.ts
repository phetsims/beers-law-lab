// Copyright 2013-2025, University of Colorado Boulder

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
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BLLConstants from '../../common/BLLConstants.js';

const SCALE = 0.75;

type SelfOptions = EmptySelfOptions;

type BLLFaucetNodeOptions = SelfOptions & PickRequired<FaucetNodeOptions, 'tandem' | 'accessibleName' | 'accessibleHelpText'>;

export default class BLLFaucetNode extends FaucetNode {

  protected constructor( faucet: Faucet, modelViewTransform: ModelViewTransform2, providedOptions: BLLFaucetNodeOptions ) {

    const horizontalPipeLength = modelViewTransform.modelToViewX( faucet.position.x - faucet.pipeMinX ) / SCALE;

    const options = optionize<BLLFaucetNodeOptions, SelfOptions, FaucetNodeOptions>()( {

      // FaucetNodeOptions
      isDisposable: false,
      horizontalPipeLength: horizontalPipeLength,
      scale: SCALE,
      shooterOptions: {
        touchAreaXDilation: 37,
        touchAreaYDilation: 60
      },
      visiblePropertyOptions: {
        phetioFeatured: true
      },

      // aria-valuetext: {{flowRate}} {{units}}
      pdomCreateAriaValueText: flowRate => {
        if ( BLLPreferences.beakerUnitsProperty.value === 'liters' ) {
          return StringUtils.fillIn( BeersLawLabStrings.a11y.valueUnitsPatternStringProperty, {
            value: toFixed( flowRate, BLLConstants.DECIMAL_PLACES_LITERS_PER_SECOND ),
            units: BeersLawLabStrings.a11y.unitsDescription.litersPerSecondStringProperty.value
          } );
        }
        else {
          return StringUtils.fillIn( BeersLawLabStrings.a11y.valueUnitsPatternStringProperty, {
            value: toFixed( flowRate * 1000, BLLConstants.DECIMAL_PLACES_MILLILITERS_PER_SECOND ),
            units: BeersLawLabStrings.a11y.unitsDescription.millilitersPerSecondStringProperty.value
          } );
        }
      },

      // Dynamic dependencies used in pdomCreateAriaValueText.
      pdomDependencies: [
        BLLPreferences.beakerUnitsProperty,
        BeersLawLabStrings.a11y.valueUnitsPatternStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.litersPerSecondStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.millilitersPerSecondStringProperty
      ]
    }, providedOptions );

    super( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, options );

    this.translation = modelViewTransform.modelToViewPosition( faucet.position );
  }
}

beersLawLab.register( 'BLLFaucetNode', BLLFaucetNode );