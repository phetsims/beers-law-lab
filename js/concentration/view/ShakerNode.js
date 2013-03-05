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
    "SCENERY/nodes/Text",
    "SCENERY/input/SimpleDragHandler",
    "PHETCOMMON/math/MathUtil",
    "PHETCOMMON/util/Inheritance",
    "common/view/DebugOriginNode",
    "image!images/shaker.png"
  ],
  function ( Node, Image, Text, SimpleDragHandler, MathUtil, Inheritance, DebugOriginNode, shakerImage ) {

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
      var labelNode = new Text( "?", {
        font: "bold 22px Arial",
        fill: "black",
        textAlign: "center",
        textBaseline: "middle"
      } );

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
        labelNode.text = solute.formula;
        // center the label on the shaker
        var capWidth = 0.3 * imageNode.width;
        labelNode.centerX = capWidth + ( imageNode.width - capWidth ) / 2;
        labelNode.centerY = imageNode.height / 2;
      } );

      // drag handler
//      TODO mvt.modelToView(shaker.dragBounds)
//      MovableDragHandler.register( this, shaker.dragBounds, function ( point ) {
//        shaker.locationProperty.set( mvt.viewToModel( point ) );
//      } );

      this.addInputListener( new SimpleDragHandler(
        {
          start: function ( event ) {
            console.log( "start" );
          },

          end: function ( event ) {
            console.log( "end" );
          },

          drag: function ( event ) {
            console.log( "drag" );
          },

          translate: function() {
            // no-op, so dragging won't directly translate the node
          }
        } ) );
    }

    Inheritance.inheritPrototype( ShakerNode, Node );

    return ShakerNode;
  } );
