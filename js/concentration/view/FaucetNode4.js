// Copyright 2002-2013, University of Colorado

/**
 * Faucet with a horizontal slider on the faucet pipe.
 * Moving the slider thumb changes the flow rate.
 * Releasing the thumb sets the flow rate to zero.
 * When the faucet is disabled, the flow rate is set to zero and the thumb is disabled.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var BLLImages = require( "common/BLLImages" );
  var Circle = require( "SCENERY/nodes/Circle" );
  var Dimension2 = require( "DOT/Dimension2" );
  var FillHighlighter = require( "common/view/FillHighlighter" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "DOT/LinearFunction" );
  var Matrix3 = require( "DOT/Matrix3" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Property = require( "AXON/Property" );
  var Range = require( "DOT/Range" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Transform3 = require( "DOT/Transform3" );
  var Util = require( "DOT/Util" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var DEBUG_ORIGIN = false;
  var SPOUT_OUTPUT_CENTER_X = 93; // center of spout, determined by inspecting image file
  var THUMB_SIZE = new Dimension2( 25, 35 );
  var THUMB_FILL_ENABLED = "rgb(50,145,184)";
  var THUMB_FILL_HIGHLIGHTED = "rgb(71,207,255)";
  var THUMB_FILL_DISABLED = "#F0F0F0";

  function FaucetSlider( range, trackSize, value, enabled, snapToMinWhenReleased ) {

    var thisNode = this;
    Node.call( thisNode );

    // mapping between value and track position
    var valueToPosition = new LinearFunction( range.min, range.max, 0, trackSize.width, true /* clamp */ );

    // track
    var track = new Rectangle( 0, 0, trackSize.width, trackSize.height,
                               { fill: "white", stroke: "black", lineWidth: 1 } );
    thisNode.addChild( track );

    // thumb, points down
    var thumb = new Path(
        {
          cursor: "pointer",
          shape: new Shape()/* clockwise from bottom left */
              .moveTo( -THUMB_SIZE.width / 2, -THUMB_SIZE.height )
              .lineTo( THUMB_SIZE.width / 2, -THUMB_SIZE.height )
              .lineTo( THUMB_SIZE.width / 2, -0.35 * THUMB_SIZE.height )
              .lineTo( 0, 0 )
              .lineTo( -THUMB_SIZE.width / 2, -0.35 * THUMB_SIZE.height )
              .close(),
          fill: THUMB_FILL_ENABLED,
          stroke: "black",
          lineWidth: 1
        } );
    thumb.centerY = track.centerY;
    thisNode.addChild( thumb );

    // enable/disable thumb
    enabled.link( function( enabled ) {
      thumb.fill = enabled ? THUMB_FILL_ENABLED : THUMB_FILL_DISABLED;
      thumb.cursor = enabled ? "pointer" : "default";
    } );

    // highlight on mouse enter
    thumb.addInputListener( new FillHighlighter( THUMB_FILL_ENABLED, THUMB_FILL_HIGHLIGHTED, enabled ) );

    // update value when thumb is dragged
    var clickXOffset = 0; // x-offset between initial click and thumb's origin
    thumb.addInputListener( new SimpleDragHandler(
        {
          start: function( event ) {
            clickXOffset = thumb.globalToParentPoint( event.pointer.point ).x - thumb.x;
          },
          drag: function( event ) {
            if ( enabled.get() ) {
              var x = thumb.globalToParentPoint( event.pointer.point ).x - clickXOffset;
              value.set( valueToPosition.inverse( x ) );
            }
          },
          end: function() {
            if ( snapToMinWhenReleased ) {
              value.set( range.min );
            }
          },
          translate: function() {
          }
        } )
    );

    // update thumb location when value changes
    value.link( function( value ) {
      thumb.centerX = valueToPosition( value );
    } );
  }

  inherit( Node, FaucetSlider );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function FaucetNode4( faucet, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // child nodes
    var pipeNode = new Image( BLLImages.getImage( "faucet4_pipe.png" ) );
    var spoutNode = new Image( BLLImages.getImage( "faucet4_spout.png" ) );
    var slider = new FaucetSlider( new Range( 0, faucet.maxFlowRate ), new Dimension2( 75, 5 ), faucet.flowRate, faucet.enabled, true );

    // rendering order
    thisNode.addChild( pipeNode );
    thisNode.addChild( spoutNode );
    thisNode.addChild( slider );

    // origin
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new Circle( { radius: 3, fill: 'red' } ) );
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
      pipeNode.top = spoutNode.top;
      // slider
      slider.x = spoutNode.left + 15;
      slider.y = spoutNode.top + 20;
    }

    // move to model location
    var location = mvt.modelToViewPosition( faucet.location );
    thisNode.x = location.x;
    thisNode.y = location.y;
  }

  inherit( Node, FaucetNode4 );

  return FaucetNode4;
} );
