// Copyright 2002-2013, University of Colorado

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLFont = require( "common/BLLFont" );
  var BLLImages = require( "common/BLLImages" );
  var Circle = require( "SCENERY/nodes/Circle" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var HTMLText = require( "SCENERY/nodes/HTMLText" );
  var Vector2 = require( "DOT/Vector2" );

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
    var imageNode = new Image( BLLImages.getImage( "shaker.png" ) );
    imageNode.setScaleMagnitude( 0.75 );

    // label
    var labelNode = new HTMLText( shaker.solute.formula, { font: new BLLFont( 22, "bold" ), fill: "black" } );

    // common parent, to simplify rotation and label alignment.
    var parentNode = new Node();
    thisNode.addChild( parentNode );
    parentNode.addChild( imageNode );
    parentNode.addChild( labelNode );
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

    // drag handler
    thisNode.addInputListener( new MovableDragHandler( shaker, mvt ) );
  }

  inherit( ShakerNode, Node );

  return ShakerNode;
} );
