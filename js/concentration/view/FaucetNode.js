// Copyright 2002-2013, University of Colorado

/**
 * Faucet, with a movable handle to control the flow rate.
 * Releasing the handle sets the flow rate to zero.
 * When the faucet is disabled, the flow rate is set to zero and the handle is disabled.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "SCENERY/nodes/Node",
    "SCENERY/nodes/Image",
    "SCENERY/input/SimpleDragHandler",
    "DOT/Vector2",
    "PHETCOMMON/math/Range",
    "PHETCOMMON/util/Inheritance",
    "common/view/DebugOriginNode",
    "common/util/LinearFunction",
    "image!images/faucet_handle.png",
    "image!images/faucet_pipe.png",
    "image!images/faucet_pivot.png",
    "image!images/faucet_spout.png"
  ],
  function ( Node, Image, SimpleDragHandler, Vector2, Range, Inheritance, DebugOriginNode, LinearFunction, handleImage, pipeImage, pivotImage, spoutImage ) {

    var DEBUG_ORIGIN = true;

    // where the fluid should come out of the unscaled spout image.
    var SPOUT_OUTPUT_CENTER_X = 85;
    var SPOUT_OUTPUT_WIDTH = 42;

    var HANDLE_ORIENTATION_RANGE = new Range( -Math.PI / 4, 0 ); // full off -> full on

    function FaucetNode( faucet, mvt ) {

      Node.call( this ); // constructor stealing

      console.log( "length=" + HANDLE_ORIENTATION_RANGE.getLength() );//XXX
      var orientationToFlowRate = new LinearFunction( HANDLE_ORIENTATION_RANGE, new Range( 0, faucet.maxFlowRate ) );

      // child nodes
      var handleNode = new Image( handleImage, {
        cursor: "pointer"
      } );
      var pipeNode = new Image( pipeImage );
      var pivotNode = new Image( pivotImage );
      var spoutNode = new Image( spoutImage );

      // rendering order
      this.addChild( pipeNode );
      this.addChild( handleNode );
      this.addChild( pivotNode );
      this.addChild( spoutNode );

      // origin
      if ( DEBUG_ORIGIN ) {
        this.addChild( new DebugOriginNode( "red" ) );
      }

      //TODO This is horizontally stretching the image, would look better to tile a rectangle with a texture.
      // size the pipe
      pipeNode.setScale( mvt.modelToView( faucet.pipeLength ) / pipeNode.width, 1 );

      // layout
      {
        // move spout's origin to the center of it's output
        spoutNode.x = -SPOUT_OUTPUT_CENTER_X;
        spoutNode.y = -spoutNode.height;
        // pipe connects to left edge of spout
        pipeNode.x = spoutNode.getLeft() - pipeNode.width;
        pipeNode.y = spoutNode.getTop();
        // pivot is on top of spout
        pivotNode.x = spoutNode.getLeft() + ( 0.25 * spoutNode.width );
        pivotNode.y = spoutNode.getTop() - pivotNode.height;
        // butt end of handle is centered in pivot
        handleNode.x = pivotNode.getCenterX();
        handleNode.y = pivotNode.getCenterY() - ( handleNode.height / 2 );
        // handle is initially in the "off" orientation
        handleNode.rotateAround( new Vector2( pivotNode.getCenterX(), pivotNode.getCenterY() ), HANDLE_ORIENTATION_RANGE.min );
      }

      // move to model location
      var location = mvt.modelToView( faucet.location );
      this.x = location.x;
      this.y = location.y;

      handleNode.addInputListener( new SimpleDragHandler(
        {
          translate: function( options ) {
            var handleOrientation = HANDLE_ORIENTATION_RANGE.max; // TODO compute based on options.position
            var flowRate = orientationToFlowRate.evaluate( handleOrientation );
            faucet.flowRateProperty.set( flowRate );
          }
        } ) );

      faucet.flowRateProperty.addObserver( function ( flowRate ) {
        // butt end of handle is centered in pivot
        handleNode.x = pivotNode.getCenterX();
        handleNode.y = pivotNode.getCenterY() - ( handleNode.height / 2 );
        // handle orientation matches flow rate
        var orientation = orientationToFlowRate.evaluateInverse( flowRate );
        console.log( "orientation=" + orientation );//XXX
        handleNode.rotateAround( new Vector2( pivotNode.getCenterX(), pivotNode.getCenterY() ), HANDLE_ORIENTATION_RANGE.min );
      } );
    }

    Inheritance.inheritPrototype( FaucetNode, Node ); // prototype chaining

    return FaucetNode;
  }
);
