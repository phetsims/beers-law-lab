// Copyright 2013-2023, University of Colorado Boulder

/**
 * Radio button group that selects the solute form, either solid (shaker) or solution (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Image, Node, Text } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem, AquaRadioButtonGroupOptions } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import dropperIcon_png from '../../../images/dropperIcon_png.js';
import shakerIcon_png from '../../../images/shakerIcon_png.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import SoluteForm from '../model/SoluteForm.js';

type SelfOptions = EmptySelfOptions;

type SoluteFormRadioButtonGroupOptions = SelfOptions & PickRequired<AquaRadioButtonGroupOptions, 'tandem'>;

export default class SoluteFormRadioButtonGroup extends AquaRadioButtonGroup<SoluteForm> {

  public constructor( soluteFormProperty: EnumerationProperty<SoluteForm>,
                      providedOptions: SoluteFormRadioButtonGroupOptions ) {

    const options = optionize<SoluteFormRadioButtonGroupOptions, SelfOptions, AquaRadioButtonGroupOptions>()( {

      // AquaRadioButtonGroupOptions
      orientation: 'horizontal',
      spacing: 60,
      radioButtonOptions: {
        radius: BLLConstants.RADIO_BUTTON_RADIUS
      },
      touchAreaXDilation: 8,
      touchAreaYDilation: 3,
      mouseAreaXDilation: 8,
      mouseAreaYDilation: 3
    }, providedOptions );

    // radio button descriptions
    const items: AquaRadioButtonGroupItem<SoluteForm>[] = [
      {
        value: SoluteForm.SOLID,
        createNode: tandem => createRadioButtonLabel( BeersLawLabStrings.solidStringProperty, shakerIcon_png, tandem ),
        tandemName: 'solidRadioButton'
      },
      {
        value: SoluteForm.SOLUTION,
        createNode: tandem => createRadioButtonLabel( BeersLawLabStrings.solutionStringProperty, dropperIcon_png, tandem ),
        tandemName: 'solutionRadioButton'
      }
    ];

    super( soluteFormProperty, items, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Creates the label for a radio button.
 */
function createRadioButtonLabel( text: TReadOnlyProperty<string>, image: HTMLImageElement, radioButtonTandem: Tandem ): Node {
  return new HBox( {
    spacing: 10,
    children: [
      new Text( text, {
        font: new PhetFont( 22 ),
        fill: 'black',
        maxWidth: 100,
        tandem: radioButtonTandem.createTandem( 'text' ),
        phetioVisiblePropertyInstrumented: false
      } ),
      new Image( image )
    ]
  } );
}

beersLawLab.register( 'SoluteFormRadioButtonGroup', SoluteFormRadioButtonGroup );