// Copyright 2013-2020, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';

class RemoveSoluteButton extends TextPushButton {

  /**
   * @param {ConcentrationSolution} solution
   * @param {ShakerParticles} shakerParticles
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( solution, shakerParticles, tandem, options ) {

    options = merge( {
      baseColor: 'rgb(255,200,0)',
      font: new PhetFont( 22 ),
      textFill: 'black',
      xMargin: 10,
      tandem: tandem
    }, options );

    super( beersLawLabStrings.removeSolute, options );

    this.addListener( () => {
      solution.soluteAmountProperty.set( 0 );
      shakerParticles.removeAllParticles();
    } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteAmountProperty.link( soluteAmount => {
      this.enabled = ( soluteAmount > 0 );
    } );
  }
}

beersLawLab.register( 'RemoveSoluteButton', RemoveSoluteButton );
export default RemoveSoluteButton;