// Copyright 2025, University of Colorado Boulder

/**
 * DetectorModeRadioButtonGroup selects what the detector is measuring ('transmittance' or 'absorbance').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import DetectorMode from '../model/DetectorMode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import BLLConstants from '../../common/BLLConstants.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import beersLawLab from '../../beersLawLab.js';

export default class DetectorModeRadioButtonGroup extends AquaRadioButtonGroup<DetectorMode> {

  public constructor( modeProperty: Property<DetectorMode>, tandem: Tandem ) {

    const textOptions: TextOptions = {
      font: new PhetFont( 18 ),
      fill: 'white',
      maxWidth: 120
    };

    const items: AquaRadioButtonGroupItem<DetectorMode>[] = [
      {
        value: DetectorMode.TRANSMITTANCE,
        createNode: () => new Text( BeersLawLabStrings.transmittanceStringProperty, textOptions ),
        tandemName: 'transmittanceRadioButton'
      },
      {
        value: DetectorMode.ABSORBANCE,
        createNode: () => new Text( BeersLawLabStrings.absorbanceStringProperty, textOptions ),
        tandemName: 'absorbanceRadioButton'
      }
    ];

    super( modeProperty, items, {
      radioButtonOptions: {
        radius: BLLConstants.RADIO_BUTTON_RADIUS
      },
      orientation: 'vertical',
      align: 'left',
      spacing: 15,
      accessibleName: BeersLawLabStrings.a11y.detectorModeRadioButtonGroup.accessibleNameStringProperty,
      accessibleHelpText: BeersLawLabStrings.a11y.detectorModeRadioButtonGroup.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}

beersLawLab.register( 'DetectorModeRadioButtonGroup', DetectorModeRadioButtonGroup );