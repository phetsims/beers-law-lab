// Copyright 2013, University of Colorado

/**
 * Radio buttons that select the solution form, either solid (shaker) or stock solution (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var RadioButtonNode = require( "common/view/RadioButtonNode" );
  var Text = require( "SCENERY/nodes/Text" );

  // images
  var dropperIcon = require( "image!images/dropper-icon.png" );
  var shakerIcon = require( "image!images/shaker-icon.png" );

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

  inherit( TextAndIconNode, Node );

  /**
   * @param {Shaker} shaker
   * @param {Dropper} dropper
   * @constructor
   */
  function SoluteFormNode( shaker, dropper )  {

    var thisNode = this;
    Node.call( thisNode );

    var TEXT_OPTIONS = { font: "22px Arial", fill: 'black' };
    var X_SPACING = 10;
    var shakerButton = new RadioButtonNode( shaker.visible, true, new TextAndIconNode( BLLStrings.solid, TEXT_OPTIONS, shakerIcon, X_SPACING ) );
    var dropperButton = new RadioButtonNode( dropper.visible, true, new TextAndIconNode( BLLStrings.solution, TEXT_OPTIONS, dropperIcon, X_SPACING ) );

    // rendering order
    thisNode.addChild( shakerButton );
    thisNode.addChild( dropperButton );

    // layout
    dropperButton.left = shakerButton.right + 40;

    // ensure mutual exclusivity
    shaker.visible.addObserver( function ( visible ) {
      dropper.visible.set( !visible );
    } );
    dropper.visible.addObserver( function ( visible ) {
      shaker.visible.set( !visible );
    } );
  }

  inherit( SoluteFormNode, Node );

  return SoluteFormNode;
});