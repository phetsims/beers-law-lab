// Copyright 2013-2020, University of Colorado Boulder

/**
 * Radio button group that selects the solute form, either 'solid' (shaker) or 'solution' (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import dropperIconImage from '../../../images/dropper-icon_png.js';
import shakerIconImage from '../../../images/shaker-icon_png.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';

// constants
const RADIO_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 22 ), fill: 'black' };

class SoluteFormRadioButtonGroup extends AquaRadioButtonGroup {

  /**
   * @param {Property.<string>} soluteFormProperty form of the solute, 'solid' or 'solution'
   * @param {Shaker} shaker
   * @param {Dropper} dropper
   * @param {Object} [options]
   */
  constructor( soluteFormProperty, shaker, dropper, options ) {

    options = merge( {
      orientation: 'horizontal',
      spacing: 60,
      radioButtonOptions: {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        visiblePropertyOptions: { phetioReadOnly: true }
      },
      touchAreaYDilation: 2,
      tandem: Tandem.REQUIRED
    }, options );

    // radio button descriptions
    const items = [
      {
        value: 'solid',
        node: createRadioButtonLabel( beersLawLabStrings.solid, shakerIconImage, RADIO_BUTTON_TEXT_OPTIONS ),
        tandemName: 'solidRadioButton'
      },
      {
        value: 'solution',
        node: createRadioButtonLabel( beersLawLabStrings.solution, dropperIconImage, RADIO_BUTTON_TEXT_OPTIONS ),
        tandemName: 'solutionRadioButton'
      }
    ];

    super( soluteFormProperty, items, options );

    soluteFormProperty.link( soluteForm => {
      shaker.visibleProperty.set( soluteForm === 'solid' );
      dropper.visibleProperty.set( soluteForm === 'solution' );
    } );

    shaker.visibleProperty.link( visible => {
      soluteFormProperty.set( visible ? 'solid' : 'solution' );
    } );

    dropper.visibleProperty.link( visible => {
      soluteFormProperty.set( visible ? 'solution' : 'solid' );
    } );
  }
}

/**
 * Creates the label for a radio button.
 * @param {string} text
 * @param {Image} image
 * @param {Object} [textOptions]
 */
function createRadioButtonLabel( text, image, textOptions ) {
  return new HBox( {
    spacing: 10,
    children: [ new Text( text, textOptions ), new Image( image ) ]
  } );
}

beersLawLab.register( 'SoluteFormRadioButtonGroup', SoluteFormRadioButtonGroup );
export default SoluteFormRadioButtonGroup;