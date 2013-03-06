// Copyright 2002-2013, University of Colorado

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "SCENERY/nodes/Node",
    "SCENERY/nodes/Image",
    "SCENERY/nodes/DOM",
    "PHETCOMMON/math/MathUtil",
    "PHETCOMMON/math/Point2D",
    "PHETCOMMON/util/Inheritance",
    "common/view/DebugOriginNode",
    "common/view/MovableDragHandler",
    "image!images/shaker.png"
  ],
  function ( Node, Image, DOM, MathUtil, Point2D, Inheritance, DebugOriginNode, MovableDragHandler, shakerImage ) {

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
      imageNode.setScale( 0.75 );

      // label
      var $labelElement = $( '<div>' );
      $labelElement.css(
        { "font":"bold 22px Arial",
          "fill": "black",
          "textAlign": "center",
          "textBaseline": "middle"
        } );
      var labelNode = new DOM( $labelElement[0] );
      labelNode.paintCanvas = function() {};//XXX workaround for scenery bug

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
      shaker.locationProperty.addObserver( function updateLocation( location ) {
        shakerNode.x = mvt.modelToView( location.x );
        shakerNode.y = mvt.modelToView( location.y );
      } );

      // sync visibility with model
      shaker.visibleProperty.addObserver( function updateVisibility( visible ) {
        shakerNode.visible = visible;
      } );

      // sync solute with model
      shaker.soluteProperty.addObserver( function updateSolute( solute ) {
        // label the shaker with the solute formula
        $labelElement.html( solute.formula );
        labelNode.invalidateDOM(); //TODO remove this when scenery handles it automatically
        //XXX bounds are bad at this point due to invalidateDOM bug, so layout below is wrong
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
