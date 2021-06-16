[object Promise]

/**
 * Radio button group that selects the solute form, either solid (shaker) or solution (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
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
import SoluteForm from '../model/SoluteForm.js';

// constants
const RADIO_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 22 ), fill: 'black' };

class SoluteFormRadioButtonGroup extends AquaRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<SoluteForm>} soluteFormProperty
   * @param {Property.<boolean>} shakerVisibleProperty
   * @param {Property.<boolean>} dropperVisibleProperty
   * @param {Object} [options]
   */
  constructor( soluteFormProperty, shakerVisibleProperty, dropperVisibleProperty, options ) {
    assert && assert( soluteFormProperty instanceof Property );
    assert && assert( shakerVisibleProperty instanceof Property );
    assert && assert( dropperVisibleProperty instanceof Property );

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
        value: SoluteForm.SOLID,
        node: createRadioButtonLabel( beersLawLabStrings.solid, shakerIconImage, RADIO_BUTTON_TEXT_OPTIONS ),
        tandemName: 'solidRadioButton'
      },
      {
        value: SoluteForm.SOLUTION,
        node: createRadioButtonLabel( beersLawLabStrings.solution, dropperIconImage, RADIO_BUTTON_TEXT_OPTIONS ),
        tandemName: 'solutionRadioButton'
      }
    ];

    super( soluteFormProperty, items, options );

    soluteFormProperty.link( soluteForm => {
      shakerVisibleProperty.value = ( soluteForm === SoluteForm.SOLID );
      dropperVisibleProperty.value = ( soluteForm === SoluteForm.SOLUTION );
    } );

    shakerVisibleProperty.link( visible => {
      soluteFormProperty.value = ( visible ? SoluteForm.SOLID : SoluteForm.SOLUTION );
    } );

    dropperVisibleProperty.link( visible => {
      soluteFormProperty.value = ( visible ? SoluteForm.SOLUTION : SoluteForm.SOLID );
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