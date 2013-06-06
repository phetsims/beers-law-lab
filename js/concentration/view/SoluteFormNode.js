// Copyright 2002-2013, University of Colorado

/**
 * Radio buttons that select the solution form, either solid (shaker) or stock solution (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLFont = require( "common/BLLFont" );
  var BLLImages = require( "common/BLLImages" );
  var BLLStrings = require( "common/BLLStrings" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Property = require( "AXON/Property" );
  var RadioButton = require( "SUN/RadioButton" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {String} text
   * @param {*} textOptions
   * @param {*} image any type supported by scenery.Image
   * @param {Number} xSpacing
   * @constructor
   */
  function TextAndIconNode( text, textOptions, image, xSpacing ) {
    var thisNode = this;
    Node.call( thisNode );
    var textNode = new Text( text, textOptions );
    var imageNode = new Image( image );
    thisNode.addChild( textNode );
    thisNode.addChild( imageNode );
    imageNode.left = textNode.right + xSpacing;
    imageNode.centerY = textNode.centerY;
  }

  inherit( Node, TextAndIconNode );

  /**
   * @param {Shaker} shaker
   * @param {Dropper} dropper
   * @constructor
   */
  function SoluteFormNode( shaker, dropper ) {

    var thisNode = this;
    Node.call( thisNode );

    var TEXT_OPTIONS = { font: new BLLFont( 22 ), fill: "black" };
    var X_SPACING = 10;
    var shakerButton = new RadioButton( shaker.visible, true, new TextAndIconNode( BLLStrings.solid, TEXT_OPTIONS, BLLImages.getImage( "shaker-icon.png" ), X_SPACING ) );
    var dropperButton = new RadioButton( dropper.visible, true, new TextAndIconNode( BLLStrings.solution, TEXT_OPTIONS, BLLImages.getImage( "dropper-icon.png" ), X_SPACING ) );

    // rendering order
    thisNode.addChild( shakerButton );
    thisNode.addChild( dropperButton );

    // layout
    dropperButton.left = shakerButton.right + 40;

    // ensure mutual exclusivity
    shaker.visible.link( function( visible ) {
      dropper.visible.set( !visible );
    } );
    dropper.visible.link( function( visible ) {
      shaker.visible.set( !visible );
    } );
  }

  inherit( Node, SoluteFormNode );

  return SoluteFormNode;
} );