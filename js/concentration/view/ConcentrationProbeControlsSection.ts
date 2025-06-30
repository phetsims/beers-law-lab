// Copyright 2025, University of Colorado Boulder

/**
 * ConcentrationProbeControlsSection is the keyboard help section labeled 'Concentration Probe Controls'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import { ConcentrationProbeNode } from './ConcentrationProbeNode.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import beersLawLab from '../../beersLawLab.js';

export class ConcentrationProbeControlsSection extends KeyboardHelpSection {

  public constructor() {

    const rows = [

      // J, for 'Jump'
      KeyboardHelpSectionRow.fromHotkeyData( ConcentrationProbeNode.JUMP_TO_POSITION_HOTKEY_DATA )
    ];

    super( BeersLawLabStrings.keyboardHelpDialog.concentrationProbeControlsStringProperty, rows, {
      textMaxWidth: 300,
      isDisposable: false
    } );
  }
}

beersLawLab.register( 'ConcentrationProbeControlsSection', ConcentrationProbeControlsSection );