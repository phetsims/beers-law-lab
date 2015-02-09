// Copyright 2002-2013, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Sound = require( 'VIBE/Sound' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // audio
  var removeSoluteAudio = require( 'audio!BEERS_LAW_LAB/remove-solute-1' );

  // strings
  var removeSoluteString = require( 'string!BEERS_LAW_LAB/removeSolute' );

  /**
   * @param {ConcentrationSolution} solution
   * @param {ShakerParticles} shakerParticles
   * @constructor
   */
  function RemoveSoluteButton( solution, shakerParticles ) {

    var thisButton = this;

    TextPushButton.call( thisButton, removeSoluteString, {
      baseColor: 'rgb(255,200,0)',
      font: new PhetFont( 22 ),
      textFill: 'black',
      xMargin: 10
    } );

    var removeSoluteSound = new Sound( removeSoluteAudio );

    this.addListener( function() {
      solution.soluteAmount.set( 0 );
      shakerParticles.removeAllParticles();
      removeSoluteSound.play();
    } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteAmount.link( function( soluteAmount ) {
      thisButton.enabled = ( soluteAmount > 0 );
    } );
  }

  return inherit( TextPushButton, RemoveSoluteButton );
} );
