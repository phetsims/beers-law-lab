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

    Node.call( this );

    var TEXT_OPTIONS = { font: new PhetFont( 22 ), fill: 'black' };
    var X_SPACING = 10;
    var shakerButton = new AquaRadioButton( shaker.visibleProperty, true, new TextAndIconNode( solidString, TEXT_OPTIONS, shakerIconImage, X_SPACING ), {
      componentID: 'concentrationScreen.solidRadioButton'
    } );
    var dropperButton = new AquaRadioButton( dropper.visibleProperty, true, new TextAndIconNode( solutionString, TEXT_OPTIONS, dropperIconImage, X_SPACING ), {
      componentID: 'concentrationScreen.solutionRadioButton'
    } );
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
    shaker.visibleProperty.link( function( visible ) {
      dropper.visibleProperty.set( !visible );
    } );
    dropper.visibleProperty.link( function( visible ) {
      shaker.visibleProperty.set( !visible );
    } );

    // This property was added for the together API.
    // TODO: This should be the fundamental property, and shaker visible/dropper visible should derive from this
    var soluteFormProperty = new Property( dropper.visibleProperty.value ? 'liquid' : 'solid', { componentID: 'concentrationScreen.soluteForm' } );

    soluteFormProperty.link( function( soluteForm ) {
      shaker.visibleProperty.set( soluteForm === 'solid' );
      dropper.visibleProperty.set( soluteForm === 'liquid' );
    } );

    // Link these afterwards since the soluteFormProperty value may be customized on startup, and we don't want the value
    // to be immediately overriden
    shaker.visibleProperty.link( function() {
      soluteFormProperty.value = dropper.visibleProperty.value ? 'liquid' : 'solid';
    } );
    dropper.visibleProperty.link( function() {
      soluteFormProperty.value = dropper.visibleProperty.value ? 'liquid' : 'solid';
    } );
  }

  return inherit( Node, SoluteFormNode );
} );