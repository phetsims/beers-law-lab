// Copyright 2025, University of Colorado Boulder

//TODO https://github.com/phetsims/beers-law-lab/issues/345 Address duplication across screens.
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

export default class BeersLawKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [
      new MoveDraggableItemsKeyboardHelpSection(),
      new SliderControlsKeyboardHelpSection()
    ];

    // Sections in the right column.
    const rightSections = [
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