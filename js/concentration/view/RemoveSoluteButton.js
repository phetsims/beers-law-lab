// Copyright 2013-2017, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var removeSoluteString = require( 'string!BEERS_LAW_LAB/removeSolute' );

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

      // Pass the supertypeTandem to the parent, then mutate ours to addInstance at the end of the constructor
      tandem: tandem.createSupertypeTandem()
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

    // tandem support
    this.mutate( {
      tandem: tandem
    } );
  }

  beersLawLab.register( 'RemoveSoluteButton', RemoveSoluteButton );

  return inherit( TextPushButton, RemoveSoluteButton );
} );
