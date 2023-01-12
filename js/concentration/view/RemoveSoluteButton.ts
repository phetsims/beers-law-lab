// Copyright 2013-2023, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import ShakerParticles from '../model/ShakerParticles.js';

type SelfOptions = EmptySelfOptions;

type RemoveSoluteButtonOptions = SelfOptions & PickRequired<TextPushButtonOptions, 'tandem'>;

export default class RemoveSoluteButton extends TextPushButton {

  public constructor( solution: ConcentrationSolution,
                      shakerParticles: ShakerParticles,
                      providedOptions: RemoveSoluteButtonOptions ) {

    const options = optionize<RemoveSoluteButtonOptions, SelfOptions, TextPushButtonOptions>()( {

      // TextPushButtonOptions
      baseColor: 'rgb(255,200,0)',
      font: new PhetFont( 22 ),
      textFill: 'black',
      xMargin: 10,
      maxWidth: 200,
      enabledPropertyOptions: {
        phetioReadOnly: true
      }
    }, providedOptions );

    super( BeersLawLabStrings.removeSoluteStringProperty, options );

    this.addListener( () => {
      solution.soluteMolesProperty.value = 0;
      shakerParticles.removeAllParticles();
    } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteMolesProperty.link( soluteAmount => {
      this.enabled = ( soluteAmount > 0 );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'RemoveSoluteButton', RemoveSoluteButton );