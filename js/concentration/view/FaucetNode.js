// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet with a pinball machine "shooter".
 * Pulling out the shooter changes the flow rate.
 * Releasing the shooter sets the flow rate to zero.
 * When the faucet is disabled, the flow rate is set to zero and the shooter is disabled.
 * <p>
 * Assumes that this node's parent is in the same coordinate frame as the model-view transform.
 * Scaling must be done via options parameter, eg: {scale: 0.75 }
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
  var Pattern = require( "SCENERY/util/Pattern" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Transform3 = require( "DOT/Transform3" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var DEBUG_ORIGIN = false;
  var SPOUT_OUTPUT_CENTER_X = 112; // center of spout, determined by inspecting image file
  var PIPE_Y_OFFSET = 31; // y-offset of pipe in spout image
  var SHOOTER_MIN_X_OFFSET = 4; // x-offset of shooter's off position in spout image
  var SHOOTER_MAX_X_OFFSET = 66; // x-offset of shooter's full-on position in spout image
  var SHOOTER_Y_OFFSET = 17; // y-offset of shooter's centerY in spout image
  var PIPE_X_OVERLAP = 1; // overlap between pipe and spout, so vertical seam is not visible
  var SHOOTER_WINDOW_BOUNDS = new Bounds2( 10, 10, 90, 25 ); // bounds of the window in the spout image, through which you see the shooter handle

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @param {*} options
   * @constructor
   */
  function FaucetNode( faucet, mvt, options ) {

    options = _.extend( { scale: 1 }, options );

    var thisNode = this;
    Node.call( thisNode );

    // shaft
    var shaftNode = new Image( BLLImages.getImage( "faucet_shaft.png" ) );
    shaftNode.setScaleMagnitude( 0.58, 1 ); //TODO scale image file?

    // flange
    var flangeNode = new Image( BLLImages.getImage( "faucet_flange.png" ) );
    var flangeDisabledNode = new Image( BLLImages.getImage( "faucet_flange_disabled.png" ) );

    // stop
    var stopNode = new Image( BLLImages.getImage( "faucet_stop.png" ) );

    // knob
    var knobNode = new Image( BLLImages.getImage( "faucet_knob.png" ) );
    var dx = 0.5 * knobNode.width;
    var dy = 0.5 * knobNode.height;
    knobNode.touchArea = Shape.rectangle( -dx, -dy, knobNode.width + dx + dx, knobNode.height + dy + dy ); // before scaling!
    knobNode.scale( 0.4 ); //TODO scale image file?
    var knobDisabledNode = new Image( BLLImages.getImage( "faucet_knob_disabled.png" ) );
    knobDisabledNode.scale( knobNode.getScaleVector() );

    // assemble the shooter
    var shooterNode = new Node();
    shooterNode.addChild( shaftNode );
    shooterNode.addChild( stopNode );
    shooterNode.addChild( flangeNode );
    shooterNode.addChild( flangeDisabledNode );
    shooterNode.addChild( knobNode );
    shooterNode.addChild( knobDisabledNode );
    stopNode.x = shaftNode.x + 12;
    stopNode.centerY = shaftNode.centerY;
    flangeNode.left = shaftNode.right;
    flangeNode.centerY = shaftNode.centerY;
    flangeDisabledNode.x = flangeNode.x;
    flangeDisabledNode.y = flangeNode.y;
    knobNode.left = flangeNode.right - 8;
    knobNode.centerY = flangeNode.centerY;
    knobDisabledNode.x = knobNode.x;
    knobDisabledNode.y = knobNode.y;

    // pipe, tiled horizontally
    var pipeImage = BLLImages.getImage( "faucet_pipe.png" );
    var pipeWidth = ( mvt.modelToViewDeltaX( faucet.location.x - faucet.pipeMinX ) / options.scale ) - SPOUT_OUTPUT_CENTER_X + PIPE_X_OVERLAP;
    assert && assert( pipeWidth > 0 );
    var pipeNode = new Rectangle( 0, 0, pipeWidth, pipeImage.height, { fill: new Pattern( pipeImage )} );

    // other nodes
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

    // encourage dragging by the blue parts, but make the entire shooter draggable
    knobNode.cursor = "pointer";
    flangeNode.cursor = "pointer";
    shooterNode.addInputListener( new SimpleDragHandler(
      {
        target: null, // save target, because event.currentTarget is null for drag.
        startXOffset: 0, // where the drag started, relative to the target's origin, in parent view coordinates

        allowTouchSnag: true,

        start: function( event ) {
          this.target = event.currentTarget;
          this.startXOffset = this.target.globalToParentPoint( event.pointer.point ).x;
        },

        // adjust the flow
        drag: function( event ) {
          if ( faucet.enabled.get() ) {
            var xParent = this.target.globalToParentPoint( event.pointer.point ).x;
            var xOffset = xParent - this.startXOffset;
            var flowRate = offsetToFlowRate( xOffset );
            faucet.flowRate.set( flowRate );
          }
        },

        // turn off the faucet when the handle is released
        end: function() {
          faucet.flowRate.set( 0 );
          this.target = null;
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
      flangeNode.visible = enabled;
      flangeDisabledNode.visible = !enabled;
    } );

    thisNode.mutate( options );
  }

  inherit( Node, FaucetNode );

  return FaucetNode;
} );
