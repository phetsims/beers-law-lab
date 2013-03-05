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
    "SCENERY/input/SimpleDragHandler",
    "PHETCOMMON/math/MathUtil",
    "PHETCOMMON/math/Point2D",
    "PHETCOMMON/util/Inheritance",
    "common/view/DebugOriginNode",
    "image!images/shaker.png"
  ],
  function ( Node, Image, DOM, SimpleDragHandler, MathUtil, Point2D, Inheritance, DebugOriginNode, shakerImage ) {

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
      var labelNode = new DOM( $labelElement[0], {
              font: "bold 22px Arial",
              fill: "black",
              textAlign: "center",
              textBaseline: "middle"
            } );
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
        //XXX invalidateDOM doesn't work correctly until this node is connected to the scenegraph, will be fixed in scenery
        labelNode.invalidateDOM(); //TODO remove this when scenery handles it automatically
        console.log( labelNode.getBounds().toString() );//XXX bounds are bad here due to invalidateDOM bug, so layout below is wrong
        // center the label on the shaker
        var capWidth = 0.3 * imageNode.width;
        labelNode.centerX = capWidth + ( imageNode.width - capWidth - labelNode.width ) / 2;
        labelNode.centerY = ( imageNode.height - labelNode.height ) / 2;
      } );

      //XXX this functionality will be absorbed into scenery
      /**
       * Constrains a point to some bounds.
       * @param {Point2D} point
       * @param {Rectangle} bounds
       */
      var constrainBounds = function ( point, bounds ) {
        if ( bounds === undefined || bounds.contains( point.x, point.y ) ) {
          return point;
        }
        else {
          var xConstrained = Math.max( Math.min( point.x, bounds.getMaxX() ), bounds.x );
          var yConstrained = Math.max( Math.min( point.y, bounds.getMaxY() ), bounds.y );
          return new Point2D( xConstrained, yConstrained );
        }
      };

      // drag handler
      this.addInputListener( new SimpleDragHandler(
        {
          translate: function ( options ) {
            var pBounded = constrainBounds( new Point2D( options.position.x, options.position.y ), shaker.dragBounds );
            var pModel = mvt.viewToModel( pBounded );
            shaker.locationProperty.set( pModel );
          }
        } ) );
    }

    Inheritance.inheritPrototype( ShakerNode, Node );

    return ShakerNode;
  } );
