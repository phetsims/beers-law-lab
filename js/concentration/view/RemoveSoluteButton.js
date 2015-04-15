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
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

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

    this.addListener( function() {
      solution.soluteAmountProperty.set( 0 );
      shakerParticles.removeAllParticles();
    } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteAmountProperty.link( function( soluteAmount ) {
      thisButton.enabled = ( soluteAmount > 0 );
    } );

    // Together support
    together && together.addComponent( this, 'concentrationScreen.removeSoluteButton' );
  }

  return inherit( TextPushButton, RemoveSoluteButton );
} );
