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

  // constants
  var FILL_ENABLED = "black";
  var FILL_DISABLED = "rgb(175,175,175)";

  /**
   * @param {ConcentrationSolution} solution
   * @constructor
   */
  function RemoveSoluteButton( solution ) {

    var textNode = new Text( BLLStrings.removeSolute, { font: new BLLFont( 22 ) } );

    Button.call( this, textNode, function() {
      solution.soluteAmount.set( 0 );
    }, { xMargin: 10 } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteAmount.link( function( soluteAmount ) {
      textNode.fill = ( soluteAmount > 0 ) ? FILL_ENABLED : FILL_DISABLED;
    } );
  }

  inherit( Button, RemoveSoluteButton );

  return RemoveSoluteButton;
} );
