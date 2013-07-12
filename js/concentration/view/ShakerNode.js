// Copyright 2002-2013, University of Colorado Boulder

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BLLFont = require( 'common/BLLFont' );
  var BLLImages = require( 'common/BLLImages' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'common/view/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DEBUG_ORIGIN = false;
  var SHOW_ARROWS = true;
  var ARROW_LENGTH = 40;
  var ARROW_HEAD_LENGTH = 30;
  var ARROW_HEAD_WIDTH = 40;
  var ARROW_TAIL_WIDTH = 23;
  var ARROW_FILL = 'yellow';
  var ARROW_STROKE = 'rgb(160,160,160)';

  /**
   * Shows the arrows until the user has successfully dragged the shaker.
   * @param upArrowNode
   * @param downArrowNode
   * @constructor
   */
  function ArrowListener( upArrowNode, downArrowNode ) {

    var thisListener = this;

    thisListener._upArrowNode = upArrowNode;
    thisListener._downArrowNode = downArrowNode;

    thisListener._wasDragged = false;
    thisListener._isDown = false;

    DownUpListener.call( this, {
      down: function() {
          thisListener._isDown = true;
      },
      up: function() {
        thisListener._isDown = false;
      }
    } );
  }

  inherit( DownUpListener, ArrowListener, {
    enter: function() {
      if ( !this._wasDragged ) {
        this._upArrowNode.visible = this._downArrowNode.visible = true;
      }
    },
    exit: function() {
      this._upArrowNode.visible = this._downArrowNode.visible = false;
    },
    move: function() {
      if ( this._isDown ) {
        this._wasDragged = true;
        this._upArrowNode.visible = this._downArrowNode.visible = false;
      }
    }
  } );

  /**
   * Constructor
   * @param {Shaker} shaker
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ShakerNode( shaker, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // shaker image
    var imageNode = new Image( BLLImages.getImage( 'shaker.png' ) );
    imageNode.setScaleMagnitude( 0.75 );

    // label
    var labelNode = new HTMLText( shaker.solute.formula, { font: new BLLFont( 22, 'bold' ), fill: 'black' } );

    // arrows
    var downArrowShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -ARROW_HEAD_WIDTH / 2, -ARROW_HEAD_LENGTH )
      .lineTo( -ARROW_TAIL_WIDTH / 2, -ARROW_HEAD_LENGTH )
      .lineTo( -ARROW_TAIL_WIDTH / 2, -ARROW_LENGTH )
      .lineTo( ARROW_TAIL_WIDTH / 2, -ARROW_LENGTH )
      .lineTo( ARROW_TAIL_WIDTH / 2, -ARROW_HEAD_LENGTH )
      .lineTo( ARROW_HEAD_WIDTH / 2, -ARROW_HEAD_LENGTH )
      .close();
    var downArrowNode = new Path( { shape: downArrowShape, fill: ARROW_FILL, stroke: ARROW_STROKE } );
    downArrowNode.top = imageNode.bottom + 4;
    downArrowNode.centerX = imageNode.centerX;
    downArrowNode.pickable = false;
    downArrowNode.visible = false;

    var upArrowShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -ARROW_HEAD_WIDTH / 2, ARROW_HEAD_LENGTH )
      .lineTo( -ARROW_TAIL_WIDTH / 2, ARROW_HEAD_LENGTH )
      .lineTo( -ARROW_TAIL_WIDTH / 2, ARROW_LENGTH )
      .lineTo( ARROW_TAIL_WIDTH / 2, ARROW_LENGTH )
      .lineTo( ARROW_TAIL_WIDTH / 2, ARROW_HEAD_LENGTH )
      .lineTo( ARROW_HEAD_WIDTH / 2, ARROW_HEAD_LENGTH )
      .close();
    var upArrowNode = new Path( { shape: upArrowShape, fill: ARROW_FILL, stroke: ARROW_STROKE } );
    upArrowNode.bottom = imageNode.top - 4;
    upArrowNode.centerX = imageNode.centerX;
    upArrowNode.pickable = false;
    upArrowNode.visible = false;

    // common parent, to simplify rotation and label alignment.
    var parentNode = new Node();
    thisNode.addChild( parentNode );
    parentNode.addChild( imageNode );
    parentNode.addChild( labelNode );
    if ( SHOW_ARROWS ) {
      parentNode.addChild( upArrowNode );
      parentNode.addChild( downArrowNode );
    }
    parentNode.rotate( shaker.orientation - Math.PI ); // assumes that shaker points to the left in the image file

    // Manually adjust these values until the origin is in the middle hole of the shaker.
    parentNode.translate( -12, -imageNode.height / 2 );

    // origin
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    // sync location with model
    shaker.location.link( function updateLocation( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // sync visibility with model
    shaker.visible.link( function updateVisibility( visible ) {
      thisNode.setVisible( visible );
    } );

    // sync solute with model
    shaker.solute.link( function updateSolute( solute ) {
      // label the shaker with the solute formula
      labelNode.setText( solute.formula );
      // center the label on the shaker
      var capWidth = 0.3 * imageNode.width;
      labelNode.centerX = capWidth + ( imageNode.width - capWidth ) / 2;
      labelNode.centerY = imageNode.centerY;
    } );

    // interactivity
    thisNode.cursor = 'pointer';
    thisNode.addInputListener( new MovableDragHandler( shaker, mvt ) );
    thisNode.addInputListener( new ArrowListener( upArrowNode, downArrowNode ) );
  }

  inherit( Node, ShakerNode );

  return ShakerNode;
} );
