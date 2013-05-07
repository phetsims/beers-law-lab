// Copyright 2002-2013, University of Colorado

/**
 * Faucet, with a movable handle to control the flow rate.
 * Releasing the handle sets the flow rate to zero.
 * When the faucet is disabled, the flow rate is set to zero and the handle is disabled.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var BLLImages = require( "common/BLLImages" );
  var DebugOriginNode = require( "common/view/DebugOriginNode" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var Matrix3 = require( "DOT/Matrix3" );
  var Node = require( "SCENERY/nodes/Node" );
  var Range = require( "DOT/Range" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Transform3 = require( "DOT/Transform3" );
  var Util = require( "DOT/Util" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var DEBUG_ORIGIN = false;
  var SPOUT_OUTPUT_CENTER_X = 83; // center of spout, determined by inspecting image file
  var HANDLE_ORIENTATION_RANGE = new Range( -Math.PI / 4, 0 ); // full off -> full on

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function FaucetNode( faucet, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    var orientationToFlowRate = new LinearFunction( HANDLE_ORIENTATION_RANGE, new Range( 0, faucet.maxFlowRate ) );

    // child nodes
    var handleNode = new Image( BLLImages.getImage( "faucet_handle.png" ), {
      cursor: "pointer"
    } );
    var pipeNode = new Image( BLLImages.getImage( "faucet_pipe.png" ) );
    var pivotNode = new Image( BLLImages.getImage( "faucet_pivot.png" ) );
    var spoutNode = new Image( BLLImages.getImage( "faucet_spout.png" ) );

    // rendering order
    thisNode.addChild( pipeNode );
    thisNode.addChild( handleNode );
    thisNode.addChild( pivotNode );
    thisNode.addChild( spoutNode );

    // origin
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new DebugOriginNode( "red" ) );
    }

    //TODO This is horizontally stretching the image, would look better to tile a rectangle with a texture.
    // size the pipe
    var pipeWidth = mvt.modelToViewDeltaX( faucet.location.x - faucet.pipeMinX ) - SPOUT_OUTPUT_CENTER_X;
    assert && assert( pipeWidth > 0 );
    pipeNode.setScaleMagnitude( pipeWidth / pipeNode.width, 1 );

    // layout
    {
      // move spout's origin to the center of it's output
      spoutNode.x = -SPOUT_OUTPUT_CENTER_X;
      spoutNode.y = -spoutNode.height;
      // pipe connects to left edge of spout
      pipeNode.x = spoutNode.left - pipeNode.width;
      pipeNode.y = spoutNode.top;
      // pivot is on top of spout
      pivotNode.x = spoutNode.left + ( 0.25 * spoutNode.width );
      pivotNode.y = spoutNode.top - pivotNode.height;
      // butt end of handle is centered in pivot
      handleNode.x = pivotNode.centerX;
      handleNode.y = pivotNode.centerY - ( handleNode.height / 2 );
    }

    // move to model location
    var location = mvt.modelToViewPosition( faucet.location );
    thisNode.x = location.x;
    thisNode.y = location.y;

    // determine on/off handle locations
    handleNode.rotateAround( new Vector2( pivotNode.centerX, pivotNode.centerY ), HANDLE_ORIENTATION_RANGE.max );
    var handleOnY = handleNode.bottom;
    handleNode.setRotation( 0 );
    handleNode.rotateAround( new Vector2( pivotNode.centerX, pivotNode.centerY ), HANDLE_ORIENTATION_RANGE.min );
    var handleOffY = handleNode.top;
    // leave the handle in the off orientation

    // mapping from handle y-coordinate to orientation
    var yToOrientation = new LinearFunction( new Range( handleOffY, handleOnY ), HANDLE_ORIENTATION_RANGE );

    handleNode.addInputListener( new SimpleDragHandler(
        {
          //TODO: revisit this to make it feel more smooth/natural
          // adjust the flow
          drag: function( event ) {
            if ( faucet.enabled.get() ) {
              var localPosition = handleNode.globalToParentPoint( event.pointer.point );
              var y = Util.clamp( localPosition.y, handleOffY, handleOnY );
              var handleOrientation = yToOrientation.evaluate( y );
              var flowRate = orientationToFlowRate.evaluate( handleOrientation );
              faucet.flowRate.set( flowRate );
            }
          },

          // turn off the faucet when the handle is released
          end: function() {
            faucet.flowRate.set( 0 );
          },

          // prevent default behavior that translates the node
          translate: function() {
          }
        } ) );

    faucet.flowRate.addObserver( function( flowRate ) {
      // reset the handle's transform
      handleNode.resetTransform();
      // butt end of handle is centered in pivot
      handleNode.x = pivotNode.centerX;
      handleNode.y = pivotNode.centerY - ( handleNode.height / 2 );
      // handle orientation matches flow rate
      var orientation = orientationToFlowRate.evaluateInverse( flowRate );
      handleNode.rotateAround( new Vector2( pivotNode.centerX, pivotNode.centerY ), orientation );
    } );
  }

  inherit( FaucetNode, Node );

  return FaucetNode;
} );
