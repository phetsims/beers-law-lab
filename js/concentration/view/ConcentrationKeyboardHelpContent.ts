// Copyright 2025, University of Colorado Boulder

/**
 * ConcentrationKeyboardHelpContent is the content for the keyboard-help dialog in the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import beersLawLab from '../../beersLawLab.js';
import FaucetControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/FaucetControlsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import { ConcentrationProbeControlsSection } from './ConcentrationProbeControlsSection.js';

export default class ConcentrationKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Faucet Controls
      new FaucetControlsKeyboardHelpSection( {
        tapToDispenseEnabled: true
      } ),

      // Concentration Probe Controls
      new ConcentrationProbeControlsSection(),

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      // Choose a Solute
      new ComboBoxKeyboardHelpSection( {
        headingString: BeersLawLabStrings.keyboardHelpDialog.chooseASoluteStringProperty,
        thingAsLowerCaseSingular: BeersLawLabStrings.keyboardHelpDialog.soluteStringProperty,
        thingAsLowerCasePlural: BeersLawLabStrings.keyboardHelpDialog.solutesStringProperty
      } )
    ];

    // Sections in the right column.
    const rightSections = [

      // Slider Controls
      new SliderControlsKeyboardHelpSection(),

      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections, {
      isDisposable: false
    } );
  }
}

beersLawLab.register( 'ConcentrationKeyboardHelpContent', ConcentrationKeyboardHelpContent );