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
  var Bounds2 = require( "DOT/Bounds2" );
  var Circle = require( "SCENERY/nodes/Circle" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "DOT/LinearFunction" );
  var Matrix3 = require( "DOT/Matrix3" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Transform3 = require( "DOT/Transform3" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var DEBUG_ORIGIN = false;
  var FAUCET_SCALE = 0.75; //TODO scale image files so that this is 1
  var SPOUT_OUTPUT_CENTER_X = 97; // center of spout, determined by inspecting image file
  var PIPE_Y_OFFSET = 28; // y-offset of pipe in spout image
  var SHOOTER_MIN_X_OFFSET = 4; // x-offset of shooter's off position in spout image
  var SHOOTER_MAX_X_OFFSET = 59; // x-offset of shooter's full-on position in spout image
  var SHOOTER_Y_OFFSET = 16; // y-offset of shooter's centerY in spout image
  var PIPE_X_OVERLAP = 5; // overlap between pipe and spout, so vertical seam is not visible
  var SHOOTER_WINDOW_BOUNDS = new Bounds2( 10, 10, 82, 25 ); // bounds of the window in the spout image, through which you see the shooter handle

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function FaucetNode( faucet, mvt ) {

    var thisNode = this;
    Node.call( thisNode );
    thisNode.scale( FAUCET_SCALE );

    // assemble the shooter
    var shaftNode = new Image( BLLImages.getImage( "faucet_shaft.png" ) );
    shaftNode.scale( 0.8, 1 );
    var knobNode = new Image( BLLImages.getImage( "faucet_knob.png" ) );
    knobNode.scale( 0.8 );
    var knobDisabledNode = new Image( BLLImages.getImage( "faucet_knob_disabled.png" ) );
    knobDisabledNode.scale( knobNode.getScaleVector() );
    var shooterNode = new Node();
    shooterNode.addChild( shaftNode );
    shooterNode.addChild( knobNode );
    shooterNode.addChild( knobDisabledNode );
    knobNode.left = shaftNode.right - 2;
    knobNode.centerY = shaftNode.centerY;
    knobDisabledNode.x = knobNode.x;
    knobDisabledNode.y = knobNode.y;

    // other nodes
    var pipeNode = new Image( BLLImages.getImage( "faucet_pipe.png" ) );
    var spoutNode = new Image( BLLImages.getImage( "faucet_spout.png" ), { pickable: false } );
    var windowNode = new Rectangle( SHOOTER_WINDOW_BOUNDS.minX, SHOOTER_WINDOW_BOUNDS.minY,
      SHOOTER_WINDOW_BOUNDS.maxX - SHOOTER_WINDOW_BOUNDS.minX, SHOOTER_WINDOW_BOUNDS.maxY - SHOOTER_WINDOW_BOUNDS.minY,
      { fill: 'rgb(107,107,107)' } );

    // rendering order
    thisNode.addChild( windowNode );
    thisNode.addChild( shooterNode );
    thisNode.addChild( pipeNode );
    thisNode.addChild( spoutNode );

    // origin
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    //TODO This is horizontally stretching the image, it might look better to tile a rectangle with a texture.
    // size the pipe
    var pipeWidth = mvt.modelToViewDeltaX( faucet.location.x - faucet.pipeMinX ) - ( FAUCET_SCALE * SPOUT_OUTPUT_CENTER_X ) + ( FAUCET_SCALE * PIPE_X_OVERLAP );
    assert && assert( pipeWidth > 0 );
    pipeNode.setScaleMagnitude( pipeWidth / pipeNode.width / FAUCET_SCALE, 1 );

    // layout
    {
      // move spout's origin to the center of it's output
      spoutNode.x = -SPOUT_OUTPUT_CENTER_X;
      spoutNode.y = -spoutNode.height;
      // window is in the spout's coordinate frame
      windowNode.x = spoutNode.x;
      windowNode.y = spoutNode.y;
      // pipe connects to left edge of spout
      pipeNode.right = spoutNode.left + PIPE_X_OVERLAP;
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

    // interactivity
    knobNode.cursor = "pointer";
    knobNode.addInputListener( new SimpleDragHandler(
        {
          // adjust the flow
          drag: function( event ) {
            if ( faucet.enabled.get() ) {
              var x = shooterNode.globalToParentPoint( event.pointer.point ).x - SHOOTER_MIN_X_OFFSET;
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

    faucet.enabled.link( function( enabled ) {
      knobNode.visible = enabled;
      knobDisabledNode.visible = !enabled;
    } );
  }

  inherit( Node, FaucetNode );

  return FaucetNode;
} );
