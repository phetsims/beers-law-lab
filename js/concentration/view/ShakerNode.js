// Copyright 2002-2013, University of Colorado

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var DOMText = require( "common/view/DOMText" );
  var DebugOriginNode = require( "common/view/DebugOriginNode" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var Util = require( "DOT/Util" );
  var Vector2 = require( "DOT/Vector2" );

  // images
  var shakerImage = require( "image!images/shaker.png" );

  // constants
  var DEBUG_ORIGIN = false;

  /**
   * Constructor
   * @param {Shaker} shaker
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ShakerNode( shaker, mvt ) {

    var thisNode = this;
    Node.call( thisNode, {
      cursor: "pointer"
    } );

    // shaker image
    var imageNode = new Image( shakerImage );
    imageNode.setScaleMagnitude( 0.75 );

    // label
    var labelNode = new DOMText( shaker.solute.formula, { font: "bold 22px Arial", fill: "black" } );

    // common parent, to simplify rotation and label alignment.
    var parentNode = new Node();
    thisNode.addChild( parentNode );
    parentNode.addChild( imageNode );
    parentNode.addChild( labelNode );
    parentNode.rotate( Util.toDegrees( shaker.orientation - Math.PI ) );

    // Manually adjust these values until the origin is in the middle hole of the shaker.
    parentNode.translate( -12, -imageNode.height / 2 );

    // origin
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new DebugOriginNode( "red" ) );
    }

    // sync location with model
    shaker.location.addObserver( function updateLocation( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // sync visibility with model
    shaker.visible.addObserver( function updateVisibility( visible ) {
      thisNode.setVisible( visible );
    } );

    // sync solute with model
    shaker.solute.addObserver( function updateSolute( solute ) {
      // label the shaker with the solute formula
      labelNode.setText( solute.formula );
      // center the label on the shaker
      var capWidth = 0.3 * imageNode.width;
      labelNode.centerX = capWidth + ( imageNode.width - capWidth ) / 2;
      labelNode.centerY = imageNode.height / 2;
    } );

    // drag handler
    thisNode.addInputListener( new MovableDragHandler( shaker, mvt ) );
  }

  inherit( ShakerNode, Node );

  return ShakerNode;
} );
