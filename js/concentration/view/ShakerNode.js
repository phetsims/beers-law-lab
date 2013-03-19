// Copyright 2002-2013, University of Colorado

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Node = require( "SCENERY/nodes/Node" );
  var Image = require( "SCENERY/nodes/Image" );
  var DOM = require( "SCENERY/nodes/DOM" );
  var Vector2 = require( "DOT/Vector2" );
  var MathUtil = require( "PHETCOMMON/math/MathUtil" );
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var DebugOriginNode = require( "common/view/DebugOriginNode" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var shakerImage = require( "image!images/shaker.png" );

  // constants
  var DEBUG_ORIGIN = true;

  /**
   * Constructor
   * @param {Shaker} shaker
   * @param {ModelViewTransform2D} mvt
   * @constructor
   */
  function ShakerNode( shaker, mvt ) {

    Node.call( this, {
      cursor: "pointer"
    } );

    var shakerNode = this;

    // shaker image
    var imageNode = new Image( shakerImage );
    imageNode.setScaleMagnitude( 0.75 );

    // label, use DOM to support HTML for formula subscripts
    var $labelElement = $( '<div>' );
    $labelElement.css(
      { font: "bold 22px Arial",
        fill: "black"
      } );
    var labelNode = new DOM( $labelElement[0] );

    // common parent, to simplify rotation and label alignment.
    var parentNode = new Node();
    this.addChild( parentNode );
    parentNode.addChild( imageNode );
    parentNode.addChild( labelNode );
    parentNode.rotate( MathUtil.toDegrees( shaker.orientation - Math.PI ) );

    // Manually adjust these values until the origin is in the middle hole of the shaker.
    parentNode.translate( -12, -imageNode.height / 2 );

    // origin
    if ( DEBUG_ORIGIN ) {
      this.addChild( new DebugOriginNode( "red" ) );
    }

    // sync location with model
    shaker.location.addObserver( function updateLocation( location ) {
      shakerNode.translation = mvt.modelToView( location );
    } );

    // sync visibility with model
    shaker.visible.addObserver( function updateVisibility( visible ) {
      shakerNode.visible = visible;
    } );

    // sync solute with model
    shaker.solute.addObserver( function updateSolute( solute ) {
      // label the shaker with the solute formula
      $labelElement.html( solute.formula );
      labelNode.invalidateDOM(); //TODO remove this when scenery handles it automatically
      // center the label on the shaker
      var capWidth = 0.3 * imageNode.width;
      labelNode.centerX = capWidth + ( imageNode.width - capWidth ) / 2;
      labelNode.centerY = imageNode.height / 2;
    } );

    // drag handler
    this.addInputListener( new MovableDragHandler( shaker, mvt ) );
  }

  Inheritance.inheritPrototype( ShakerNode, Node );

  return ShakerNode;
} );
