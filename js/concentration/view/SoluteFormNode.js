// Copyright 2002-2013, University of Colorado Boulder

/**
 * Radio buttons that select the solution form, either solid (shaker) or stock solution (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Property = require( 'AXON/Property' );

  // strings
  var solidString = require( 'string!BEERS_LAW_LAB/solid' );
  var solutionString = require( 'string!BEERS_LAW_LAB/solution' );

  // images
  var shakerIconImage = require( 'image!BEERS_LAW_LAB/shaker-icon.png' );
  var dropperIconImage = require( 'image!BEERS_LAW_LAB/dropper-icon.png' );

  /**
   * @param {string} text
   * @param {Object} textOptions
   * @param {*} image any type supported by scenery.Image
   * @param {number} xSpacing
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

    var thisNode = this;

    Node.call( this );

    var TEXT_OPTIONS = { font: new PhetFont( 22 ), fill: 'black' };
    var X_SPACING = 10;
    var shakerButton = new AquaRadioButton( shaker.visible, true, new TextAndIconNode( solidString, TEXT_OPTIONS, shakerIconImage, X_SPACING ) );
    var dropperButton = new AquaRadioButton( dropper.visible, true, new TextAndIconNode( solutionString, TEXT_OPTIONS, dropperIconImage, X_SPACING ) );
    var separator = new Path( Shape.lineSegment( 0, 0, 0, shakerButton.height ), {
      stroke: 'rgb(150,150,150)',
      lineWidth: 0.5
    } );

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

    // This property was added for the public API.
    // TODO: This should be the fundamental property, and shaker visible/dropper visible should derive from this
    var soluteFormProperty = new Property( dropper.visible.value ? 'liquid' : 'solid' );

    shaker.visible.link( function() {
      soluteFormProperty.value = dropper.visible.value ? 'liquid' : 'solid';
    } );
    dropper.visible.link( function() {
      soluteFormProperty.value = dropper.visible.value ? 'liquid' : 'solid';
    } );

    // TODO: Will this cause any loops, etc?
    soluteFormProperty.link( function( soluteForm ) {
      shaker.visible.set( soluteForm === 'solid' );
      dropper.visible.set( soluteForm === 'liquid' );
    } );

    together && together.addComponent( 'concentrationScreen.soluteForm', soluteFormProperty );
  }

  return inherit( Node, SoluteFormNode );
} );