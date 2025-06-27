// Copyright 2025, University of Colorado Boulder

//TODO https://github.com/phetsims/beers-law-lab/issues/345 Address duplication across screens.
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

export default class ConcentrationKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Faucet Controls
      new FaucetControlsKeyboardHelpSection(),

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      // Slider Controls
      new SliderControlsKeyboardHelpSection()
    ];

    // Sections in the right column.
    const rightSections = [

      // Choose a Solute
      new ComboBoxKeyboardHelpSection( {
        headingString: BeersLawLabStrings.keyboardHelpDialog.chooseASoluteStringProperty,
        thingAsLowerCaseSingular: BeersLawLabStrings.keyboardHelpDialog.soluteStringProperty,
        thingAsLowerCasePlural: BeersLawLabStrings.keyboardHelpDialog.solutesStringProperty
      } ),

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