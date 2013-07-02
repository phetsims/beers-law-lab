// Copyright 2002-2013, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLFont = require( "common/BLLFont" );
  var BLLStrings = require( "common/BLLStrings" );
  var Button = require( "SUN/Button" );
  var inherit = require( "PHET_CORE/inherit" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {ConcentrationSolution} solution
   * @constructor
   */
  function RemoveSoluteButton( solution ) {

    var thisButton = this;

    var textNode = new Text( BLLStrings.removeSolute, { font: new BLLFont( 22 ) } );

    Button.call( thisButton, textNode, function() {
      solution.soluteAmount.set( 0 );
    }, { xMargin: 10 } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteAmount.link( function( soluteAmount ) {
      var enabled = ( soluteAmount > 0 );
      textNode.fill = enabled ? "black" : "rgb(175,175,175)";
      thisButton.cursor = enabled ? "pointer" : "default";
    } );
  }

  inherit( Button, RemoveSoluteButton );

  return RemoveSoluteButton;
} );
