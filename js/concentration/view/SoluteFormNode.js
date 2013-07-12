// Copyright 2002-2013, University of Colorado Boulder

/**
 * Radio buttons that select the solution form, either solid (shaker) or stock solution (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var BLLFont = require( 'common/BLLFont' );
  var BLLImages = require( 'common/BLLImages' );
  var BLLStrings = require( 'common/BLLStrings' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {String} text
   * @param {*} textOptions
   * @param {*} image any type supported by scenery.Image
   * @param {Number} xSpacing
   * @constructor
   */
  function TextAndIconNode( text, textOptions, image, xSpacing ) {
    Node.call( this );
    var textNode = new Text( text, textOptions );
    var imageNode = new Image( image );
    this.addChild( textNode );
    this.addChild( imageNode );
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

    Node.call( this );

    var TEXT_OPTIONS = { font: new BLLFont( 22 ), fill: 'black' };
    var X_SPACING = 10;
    var shakerButton = new AquaRadioButton( shaker.visible, true, new TextAndIconNode( BLLStrings.solid, TEXT_OPTIONS, BLLImages.getImage( 'shaker-icon.png' ), X_SPACING ) );
    var dropperButton = new AquaRadioButton( dropper.visible, true, new TextAndIconNode( BLLStrings.solution, TEXT_OPTIONS, BLLImages.getImage( 'dropper-icon.png' ), X_SPACING ) );
    var separator = new Path( { shape: Shape.lineSegment( 0, 0, 0, shakerButton.height ), stroke: 'rgb(150,150,150)', lineWidth: 0.5 } );

    // rendering order
    this.addChild( shakerButton );
    this.addChild( separator );
    this.addChild( dropperButton );

    // layout
    var SEPARATOR_SPACING = 30;
    separator.left = shakerButton.right + SEPARATOR_SPACING;
    separator.centerY = shakerButton.centerY;
    dropperButton.left = separator.right + SEPARATOR_SPACING;

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