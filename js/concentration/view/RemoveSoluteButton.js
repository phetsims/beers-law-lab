// Copyright 2013-2020, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  const removeSoluteString = require( 'string!BEERS_LAW_LAB/removeSolute' );

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

      super( removeSoluteString, options );

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

  return beersLawLab.register( 'RemoveSoluteButton', RemoveSoluteButton );
} );
