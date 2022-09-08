// Copyright 2013-2022, University of Colorado Boulder

/**
 * Radio button group that selects the solute form, either solid (shaker) or solution (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Image, Node, Text, TextOptions } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem, AquaRadioButtonGroupOptions } from '../../../../sun/js/AquaRadioButtonGroup.js';
import dropperIcon_png from '../../../images/dropperIcon_png.js';
import shakerIcon_png from '../../../images/shakerIcon_png.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import SoluteForm from '../model/SoluteForm.js';

// constants
const RADIO_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 22 ), fill: 'black' };

type SelfOptions = EmptySelfOptions;

type SoluteFormRadioButtonGroupOptions = SelfOptions & PickRequired<AquaRadioButtonGroupOptions, 'tandem'>;

export default class SoluteFormRadioButtonGroup extends AquaRadioButtonGroup<SoluteForm> {

  public constructor( soluteFormProperty: EnumerationProperty<SoluteForm>,
                      shakerVisibleProperty: Property<boolean>,
                      dropperVisibleProperty: Property<boolean>,
                      providedOptions: SoluteFormRadioButtonGroupOptions ) {

    const options = optionize<SoluteFormRadioButtonGroupOptions, SelfOptions, AquaRadioButtonGroupOptions>()( {

      // AquaRadioButtonGroupOptions
      orientation: 'horizontal',
      spacing: 60,
      radioButtonOptions: {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        visiblePropertyOptions: { phetioReadOnly: true }
      },
      touchAreaYDilation: 2
    }, providedOptions );

    // radio button descriptions
    const items: AquaRadioButtonGroupItem<SoluteForm>[] = [
      {
        value: SoluteForm.SOLID,
        createNode: tandem => createRadioButtonLabel( BeersLawLabStrings.solid, shakerIcon_png, RADIO_BUTTON_TEXT_OPTIONS ),
        tandemName: 'solidRadioButton'
      },
      {
        value: SoluteForm.SOLUTION,
        createNode: tandem => createRadioButtonLabel( BeersLawLabStrings.solution, dropperIcon_png, RADIO_BUTTON_TEXT_OPTIONS ),
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
 */
function createRadioButtonLabel( text: string, image: HTMLImageElement, textOptions: TextOptions ): Node {
  return new HBox( {
    spacing: 10,
    children: [ new Text( text, textOptions ), new Image( image ) ]
  } );
}

beersLawLab.register( 'SoluteFormRadioButtonGroup', SoluteFormRadioButtonGroup );