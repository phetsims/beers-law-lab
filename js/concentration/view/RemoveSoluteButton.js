// Copyright 2002-2013, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextPushButtonDeprecated = require( 'SUN/TextPushButtonDeprecated' );

  // strings
  var removeSoluteString = require( 'string!BEERS_LAW_LAB/removeSolute' );

  /**
   * @param {ConcentrationSolution} solution
   * @constructor
   */
  function RemoveSoluteButton( solution ) {

    var thisButton = this;

    TextPushButtonDeprecated.call( thisButton, removeSoluteString, {
      font: new PhetFont( 22 ),
      textFill: 'black',
      textFillDisabled: 'rgb(175,175,175)',
      rectangleXMargin: 10,
      rectangleFillDisabled: 'white'
    } );

    this.addListener( function() {
      solution.soluteAmount.set( 0 );
    } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteAmount.link( function( soluteAmount ) {
      thisButton.enabled = ( soluteAmount > 0 );
    } );
  }

  return inherit( TextPushButtonDeprecated, RemoveSoluteButton );
} );
