// Copyright 2002-2013, University of Colorado

/**
 * Faucet with a pinball machine "shooter".
 * Pulling out the shooter changes the flow rate.
 * Releasing the shooter sets the flow rate to zero.
 * When the faucet is disabled, the flow rate is set to zero and the shooter is disabled.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var BLLImages = require( "common/BLLImages" );
  var Circle = require( "SCENERY/nodes/Circle" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "DOT/LinearFunction" );
  var Matrix3 = require( "DOT/Matrix3" );
  var Node = require( "SCENERY/nodes/Node" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Transform3 = require( "DOT/Transform3" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var DEBUG_ORIGIN = false;
  var SPOUT_OUTPUT_CENTER_X = 63; // center of spout, determined by inspecting image file
  var PIPE_Y_OFFSET = 20; // offset of pipe in spout image
  var SHOOTER_MIN_X_OFFSET = 10; // offset of shooter's off position in spout image
  var SHOOTER_MAX_X_OFFSET = 55; // offset of shooter's full-on position in spout image
  var SHOOTER_Y_OFFSET = 12; // offset of shooter's centerY in spout image

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function FaucetNode( faucet, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // child nodes
    var shooterNode = new Image( BLLImages.getImage( "faucet_shooter.png" ), {
      cursor: "pointer"
    } );
    shooterNode.scale( 1.4 ); //TODO get an image file that doesn't require scaling up
    var pipeNode = new Image( BLLImages.getImage( "faucet_pipe.png" ) );
    var spoutNode = new Image( BLLImages.getImage( "faucet_spout.png" ), { pickable: false } );

    // rendering order
    thisNode.addChild( pipeNode );
    thisNode.addChild( shooterNode );
    thisNode.addChild( spoutNode );

    // origin
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    //TODO This is horizontally stretching the image, would look better to tile a rectangle with a texture.
    // size the pipe
    var pipeWidth = mvt.modelToViewDeltaX( faucet.location.x - faucet.pipeMinX ) - SPOUT_OUTPUT_CENTER_X;
    assert && assert( pipeWidth > 0 );
    pipeNode.setScaleMagnitude( pipeWidth / pipeNode.width, 0.95 ); //TODO y scale should be 1, but image file is off

    // layout
    {
      // move spout's origin to the center of it's output
      spoutNode.x = -SPOUT_OUTPUT_CENTER_X;
      spoutNode.y = -spoutNode.height;
      // pipe connects to left edge of spout
      pipeNode.x = spoutNode.left - pipeNode.width;
      pipeNode.top = spoutNode.top + PIPE_Y_OFFSET;
      // shooter at top of spout
      shooterNode.left = spoutNode.left + SHOOTER_MIN_X_OFFSET;
      shooterNode.centerY = spoutNode.top + SHOOTER_Y_OFFSET;
    }

    // move to model location
    var location = mvt.modelToViewPosition( faucet.location );
    thisNode.x = location.x;
    thisNode.y = location.y;

    var offsetToFlowRate = new LinearFunction( SHOOTER_MIN_X_OFFSET, SHOOTER_MAX_X_OFFSET, 0, faucet.maxFlowRate, true /* clamp */ );

    shooterNode.addInputListener( new SimpleDragHandler(
        {
          // adjust the flow
          drag: function( event ) {
            if ( faucet.enabled.get() ) {
              var x = shooterNode.globalToParentPoint( event.pointer.point ).x + SHOOTER_MIN_X_OFFSET;
              var flowRate = offsetToFlowRate( x );
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

    faucet.flowRate.link( function( flowRate ) {
      var xOffset = offsetToFlowRate.inverse( flowRate );
      shooterNode.x = spoutNode.left + xOffset;
    } );
  }

  inherit( Node, FaucetNode );

  return FaucetNode;
} );
