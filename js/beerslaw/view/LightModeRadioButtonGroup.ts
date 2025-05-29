// Copyright 2025, University of Colorado Boulder

/**
 * LightModeRadioButtonGroup selects the light mode ('preset' or 'variable').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import LightMode from '../model/LightMode.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BLLConstants from '../../common/BLLConstants.js';

export default class LightModeRadioButtonGroup extends AquaRadioButtonGroup<LightMode> {

  public constructor( lightModeProperty: EnumerationProperty<LightMode>, tandem: Tandem ) {

    const textOptions: TextOptions = {
      font: new PhetFont( 18 ),
      fill: 'black',
      maxWidth: 75
    };

    const items: AquaRadioButtonGroupItem<LightMode>[] = [
      {
        value: LightMode.PRESET,
        createNode: () => new Text( BeersLawLabStrings.presetStringProperty, textOptions ),
        tandemName: 'presetWavelengthRadioButton'
      },
      {
        value: LightMode.VARIABLE,
        createNode: () => new Text( BeersLawLabStrings.variableStringProperty, textOptions ),
        tandemName: 'variableWavelengthRadioButton'
      }
    ];

    super( lightModeProperty, items, {
      radioButtonOptions: {
        radius: BLLConstants.RADIO_BUTTON_RADIUS
      },
      orientation: 'horizontal',
      spacing: 15,
      touchAreaYDilation: 8,
      accessibleName: BeersLawLabStrings.a11y.lightModeRadioButtonGroup.accessibleNameStringProperty,
      tandem: tandem
    } );
  }
}

beersLawLab.register( 'LightModeRadioButtonGroup', LightModeRadioButtonGroup );