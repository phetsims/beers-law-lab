// Copyright 2025, University of Colorado Boulder

/**
 * DetectorModeRadioButtonGroup selects what the detector is measuring ('transmittance' or 'absorbance').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import DetectorMode from '../model/DetectorMode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BLLConstants from '../../common/BLLConstants.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import beersLawLab from '../../beersLawLab.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Detector from '../model/Detector.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';

export default class DetectorModeRadioButtonGroup extends AquaRadioButtonGroup<DetectorMode> {

  public constructor( detector: Detector, tandem: Tandem ) {

    const textOptions: TextOptions = {
      font: new PhetFont( 18 ),
      fill: 'white',
      maxWidth: 120
    };

    const transmittanceAccessibleContextResponseProperty = new DerivedStringProperty( [
        detector.transmittanceProperty,
        BeersLawLabStrings.a11y.transmittanceValueUnitsStringProperty,
        BeersLawLabStrings.a11y.transmittanceUnknownStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.percentStringProperty
      ],
      ( transmittance, transmittanceValueUnitsString, transmittanceUnknownString, percentString ) => {
        if ( transmittance === null ) {
          return transmittanceUnknownString;
        }
        else {
          return StringUtils.fillIn( transmittanceValueUnitsString, {
            transmittance: toFixed( 100 * transmittance, BLLConstants.DECIMAL_PLACES_TRANSMITTANCE ),
            units: percentString
          } );
        }
      } );

    const absorbanceAccessibleContextResponseProperty = new DerivedStringProperty( [
        detector.absorbanceProperty,
        BeersLawLabStrings.a11y.absorbanceValueStringProperty,
        BeersLawLabStrings.a11y.absorbanceUnknownStringProperty
      ],
      ( absorbance, absorbanceValueString, absorbanceUnknownString ) => {
        if ( absorbance === null ) {
          return absorbanceUnknownString;
        }
        else {
          return StringUtils.fillIn( absorbanceValueString, {
            absorbance: toFixed( absorbance, BLLConstants.DECIMAL_PLACES_ABSORBANCE )
          } );
        }
      } );

    const items: AquaRadioButtonGroupItem<DetectorMode>[] = [
      {
        value: DetectorMode.TRANSMITTANCE,
        createNode: () => new Text( BeersLawLabStrings.transmittanceStringProperty, textOptions ),
        options: {
          accessibleContextResponse: transmittanceAccessibleContextResponseProperty
        },
        tandemName: 'transmittanceRadioButton'
      },
      {
        value: DetectorMode.ABSORBANCE,
        createNode: () => new Text( BeersLawLabStrings.absorbanceStringProperty, textOptions ),
        options: {
          accessibleContextResponse: absorbanceAccessibleContextResponseProperty
        },
        tandemName: 'absorbanceRadioButton'
      }
    ];

    super( detector.modeProperty, items, {
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