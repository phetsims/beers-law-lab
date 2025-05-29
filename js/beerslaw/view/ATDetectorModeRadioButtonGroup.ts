// Copyright 2025, University of Colorado Boulder

/**
 * ATDetectorModeRadioButtonGroup is the radio button group for selecting the mode of the AT detector.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import ATDetectorMode from '../model/ATDetectorMode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import BLLConstants from '../../common/BLLConstants.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import beersLawLab from '../../beersLawLab.js';

export default class ATDetectorModeRadioButtonGroup extends AquaRadioButtonGroup<ATDetectorMode> {

  public constructor( modeProperty: Property<ATDetectorMode>, tandem: Tandem ) {

    const textOptions: TextOptions = {
      font: new PhetFont( 18 ),
      fill: 'white',
      maxWidth: 120
    };

    const items: AquaRadioButtonGroupItem<ATDetectorMode>[] = [
      {
        value: ATDetectorMode.TRANSMITTANCE,
        createNode: () => new Text( BeersLawLabStrings.transmittanceStringProperty, textOptions ),
        tandemName: 'transmittanceRadioButton'
      },
      {
        value: ATDetectorMode.ABSORBANCE,
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
      tandem: tandem
    } );
  }
}

beersLawLab.register( 'ATDetectorModeRadioButtonGroup', ATDetectorModeRadioButtonGroup );