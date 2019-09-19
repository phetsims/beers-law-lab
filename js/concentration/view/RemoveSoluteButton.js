// Copyright 2013-2017, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  const removeSoluteString = require( 'string!BEERS_LAW_LAB/removeSolute' );

  /**
   * @param {ConcentrationSolution} solution
   * @param {ShakerParticles} shakerParticles
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function RemoveSoluteButton( solution, shakerParticles, tandem, options ) {

    options = _.extend( {
      baseColor: 'rgb(255,200,0)',
      font: new PhetFont( 22 ),
      textFill: 'black',
      xMargin: 10,
      tandem: tandem
    }, options );

    var self = this;

    TextPushButton.call( this, removeSoluteString, options );

    this.addListener( function() {
      solution.soluteAmountProperty.set( 0 );
      shakerParticles.removeAllParticles();
    } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteAmountProperty.link( function( soluteAmount ) {
      self.enabled = ( soluteAmount > 0 );
    } );
  }

  beersLawLab.register( 'RemoveSoluteButton', RemoveSoluteButton );

  return inherit( TextPushButton, RemoveSoluteButton );
} );
