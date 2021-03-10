// Copyright 2013-2020, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import ShakerParticles from '../model/ShakerParticles.js';

class RemoveSoluteButton extends TextPushButton {

  /**
   * @param {ConcentrationSolution} solution
   * @param {ShakerParticles} shakerParticles
   * @param {Object} [options]
   */
  constructor( solution, shakerParticles, options ) {
    assert && assert( solution instanceof ConcentrationSolution );
    assert && assert( shakerParticles instanceof ShakerParticles );

    options = merge( {
      baseColor: 'rgb(255,200,0)',
      font: new PhetFont( 22 ),
      textFill: 'black',
      xMargin: 10,
      tandem: Tandem.REQUIRED
    }, options );

    super( beersLawLabStrings.removeSolute, options );

    this.addListener( () => {
      solution.soluteMolesProperty.value = 0;
      shakerParticles.removeAllParticles();
    } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteMolesProperty.link( soluteAmount => {
      this.enabled = ( soluteAmount > 0 );
    } );
  }
}

beersLawLab.register( 'RemoveSoluteButton', RemoveSoluteButton );
export default RemoveSoluteButton;