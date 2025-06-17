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

export default class ConcentrationKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [
      new MoveDraggableItemsKeyboardHelpSection(),
      new FaucetControlsKeyboardHelpSection()
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

beersLawLab.register( 'ConcentrationKeyboardHelpContent', ConcentrationKeyboardHelpContent );