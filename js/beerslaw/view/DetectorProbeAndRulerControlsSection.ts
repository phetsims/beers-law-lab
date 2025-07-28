// Copyright 2025, University of Colorado Boulder

/**
 * DetectorProbeAndRulerControlsSection is the keyboard help section labeled 'Concentration Probe Controls'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';

export class DetectorProbeAndRulerControlsSection extends KeyboardHelpSection {

  public constructor() {

    const rows = [

      // J, for 'Jump'
      KeyboardHelpSectionRow.fromHotkeyData( BLLConstants.JUMP_TO_POSITION_HOTKEY_DATA, {
        pdomLabelStringProperty: BeersLawLabStrings.a11y.keyboardHelpDialog.jumpToPositionDescriptionStringProperty
      } )
    ];

    super( BeersLawLabStrings.keyboardHelpDialog.detectorProbeAndRulerControlsStringProperty, rows, {
      textMaxWidth: 300,
      isDisposable: false
    } );
  }
}

beersLawLab.register( 'DetectorProbeAndRulerControlsSection', DetectorProbeAndRulerControlsSection );