// Copyright 2025, University of Colorado Boulder

/**
 * BeersLawKeyboardHelpContent is the content for the keyboard-help dialog in the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import beersLawLab from '../../beersLawLab.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import { DetectorProbeAndRulerControlsSection } from './DetectorProbeAndRulerControlsSection.js';

export default class BeersLawKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Detector Probe and Ruler Controls
      new DetectorProbeAndRulerControlsSection(),

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      // Slider Controls
      new SliderControlsKeyboardHelpSection()
    ];

    // Sections in the right column.
    const rightSections = [

      // Choose a Solution
      new ComboBoxKeyboardHelpSection( {
        headingString: BeersLawLabStrings.keyboardHelpDialog.chooseASolutionStringProperty,
        thingAsLowerCaseSingular: BeersLawLabStrings.keyboardHelpDialog.solutionStringProperty,
        thingAsLowerCasePlural: BeersLawLabStrings.keyboardHelpDialog.solutionsStringProperty
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

beersLawLab.register( 'BeersLawKeyboardHelpContent', BeersLawKeyboardHelpContent );