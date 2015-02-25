// Copyright 2002-2013, University of Colorado Boulder

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Sound = require( 'VIBE/Sound' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  // audio
  var shakeSounds = [
    new Sound( require( 'audio!BEERS_LAW_LAB/salt-shaking' ) ),
    new Sound( require( 'audio!BEERS_LAW_LAB/salt-shaking-2' ) ),
    new Sound( require( 'audio!BEERS_LAW_LAB/salt-shaking-3' ) )
  ];

  // images
  var shakerImage = require( 'image!BEERS_LAW_LAB/shaker.png' );

  // constants
  var DEBUG_ORIGIN = false;
  var ARROW_LENGTH = 40;
  var ARROW_OPTIONS = {
    tailWidth: 23,
    headWidth: 40,
    headHeight: 30,
    fill: 'yellow',
    stroke: 'rgb(160,160,160)',
    pickable: false,
    visible: false
  };

  /**
   * Constructor
   * @param {Shaker} shaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ShakerNode( shaker, modelViewTransform ) {

    var thisNode = this;
    Node.call( thisNode );

    // shaker image
    var imageNode = new Image( shakerImage );
    imageNode.setScaleMagnitude( 0.75 );

    // label
    var labelNode = new SubSupText( shaker.solute.formula, {
      font: new PhetFont( { size: 22, weight: 'bold' } ),
      fill: 'black'
    } );

    // arrows
    var downArrowNode = new ArrowNode( 0, 0, 0, ARROW_LENGTH, ARROW_OPTIONS );
    downArrowNode.top = imageNode.bottom + 4;
    downArrowNode.centerX = imageNode.centerX;

    var upArrowNode = new ArrowNode( 0, 0, 0, -ARROW_LENGTH, ARROW_OPTIONS );
    upArrowNode.bottom = imageNode.top - 4;
    upArrowNode.centerX = imageNode.centerX;

    // common parent, to simplify rotation and label alignment.
    var parentNode = new Node( { children: [ imageNode, labelNode, upArrowNode, downArrowNode ] } );
    thisNode.addChild( parentNode );
    parentNode.rotate( shaker.orientation - Math.PI ); // assumes that shaker points to the left in the image file
    // Manually adjust these values until the origin is in the middle hole of the shaker.
    parentNode.translate( -12, -imageNode.height / 2 );

    // origin
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    // sync location with model
    var shakerWasMoved = false;
    shaker.locationProperty.link( function( location ) {
      thisNode.translation = modelViewTransform.modelToViewPosition( location );
      shakerWasMoved = true;
      upArrowNode.visible = downArrowNode.visible = false;
    } );
    shakerWasMoved = false; // reset to false, because function is fired when link is performed

    // sync visibility with model
    shaker.visible.link( function( visible ) {
      thisNode.setVisible( visible );
    } );

    // sync solute with model
    shaker.solute.link( function( solute ) {
      // label the shaker with the solute formula
      labelNode.setText( solute.formula );
      // center the label on the shaker
      var capWidth = 0.3 * imageNode.width; // multiplier is dependent on image file
      labelNode.centerX = capWidth + ( imageNode.width - capWidth ) / 2;
      labelNode.centerY = imageNode.centerY;
    } );

    // produce shaking sound when dispensing
    var currentShakeSound = 0;
    var doNotPlayYetTime = 0;
    shaker.locationProperty.link( function( location ) {
      var now = (new Date).getTime();
      if ( shaker.dispensingRate.value > 0 && now > doNotPlayYetTime ) {
        shakeSounds[ currentShakeSound ].play();
        currentShakeSound = ( currentShakeSound + 1 ) % shakeSounds.length;
        doNotPlayYetTime = now + Math.random() * 100 + 100;
      }
    } );

    // interactivity
    thisNode.cursor = 'pointer';
    thisNode.addInputListener( new MovableDragHandler( shaker.locationProperty, {
      dragBounds: shaker.dragBounds,
      modelViewTransform: modelViewTransform
    } ) );
    thisNode.addInputListener( {
      enter: function() {
        upArrowNode.visible = downArrowNode.visible = !shakerWasMoved;
      },
      exit: function() {
        upArrowNode.visible = downArrowNode.visible = false;
      }
    } );
  }

  return inherit( Node, ShakerNode );
} );
