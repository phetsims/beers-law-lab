// Copyright 2002-2013, University of Colorado

/**
 * Horizontal slider.
 * Optionally snaps to min when released.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Dimension2 = require( "DOT/Dimension2" );
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Range = require( "DOT/Range" );
  var Shape = require( "KITE/Shape" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Text = require( "SCENERY/nodes/Text" );
  var Util = require( "DOT/Util" );

  // thumb constants
  var THUMB_SIZE = new Dimension2( 20, 30 );
  var THUMB_FILL_ENABLED = "rgb(50,145,184)";
  var THUMB_FILL_DISABLED = "#F0F0F0";

  // tick constants
  var MAJOR_TICK_LENGTH = 20;
  var MINOR_TICK_LENGTH = 15;

  /**
   * @param {Range} range
   * @param {Dimension2} trackSize
   * @param {Property} value (type number)
   * @param {Property} enabled (type Boolean)
   * @param {Boolean} snapToMinWhenReleased
   * @constructor
   */
  function EvaporationSliderNode( range, trackSize, value, enabled, snapToMinWhenReleased ) {

    // defaults
    snapToMinWhenReleased = _.isUndefined( snapToMinWhenReleased ) ? false : snapToMinWhenReleased;

    var thisNode = this;
    Node.call( thisNode );

    // ticks are added to this parent, so they are behind knob
    thisNode._ticksParent = new Node();
    thisNode.addChild( thisNode._ticksParent );

    // track
    thisNode._trackNode = new Path(
      {
        shape: Shape.rect( 0, 0, trackSize.width, trackSize.height ),
        fill: "white",
        stroke: "black",
        lineWidth: 1
      } );
    thisNode.addChild( thisNode._trackNode );

    // thumb
    var thumbNode = new Path(
      {
        cursor: "pointer",
        shape: new Shape()
          .moveTo( -THUMB_SIZE.width / 2, 0 )
          .lineTo( THUMB_SIZE.width / 2, 0 )
          .lineTo( THUMB_SIZE.width / 2, 0.65 * THUMB_SIZE.height )
          .lineTo( 0, THUMB_SIZE.height )
          .lineTo( -THUMB_SIZE.width / 2, 0.65 * THUMB_SIZE.height )
          .close(),
        fill: THUMB_FILL_ENABLED,
        stroke: "black",
        lineWidth: 1
      } );
    thumbNode.centerY = thisNode._trackNode.centerY;
    thisNode.addChild( thumbNode );

    // enable/disable thumb
    enabled.addObserver( function ( enabled ) {
      thumbNode.fill = enabled ? THUMB_FILL_ENABLED : THUMB_FILL_DISABLED;
      thumbNode.cursor = enabled ? "pointer" : "default";
    } );

    // mapping between value and track position
    thisNode._valueToPosition = new LinearFunction( range, new Range( 0, trackSize.width ), true /* clamp */ );

    // move thumb when value changes
    value.addObserver( function ( value ) {
      thumbNode.centerX = thisNode._valueToPosition.evaluate( value );
    } );

    // update value when thumb is dragged
    var clickXOffset = 0; // x-offset between initial click and thumb's origin
    thumbNode.addInputListener( new SimpleDragHandler(
      {
        start: function ( event ) {
          clickXOffset = thumbNode.globalToParentPoint( event.pointer.point ).x - thumbNode.x;
        },
        drag: function ( event ) {
          if ( enabled.get() ) {
            var x = thumbNode.globalToParentPoint( event.pointer.point ).x - clickXOffset;
            value.set( thisNode._valueToPosition.evaluateInverse( x ) );
          }
        },
        end: function() {
          if ( snapToMinWhenReleased ) {
            value.set( range.min );
          }
        },
        translate: function () {
        }
      } )
    );

    // update thumb location when value changes
    value.addObserver( function( value ) {
       thumbNode.centerX = thisNode._valueToPosition.evaluate( value );
    } );
  }

  inherit( EvaporationSliderNode, Node );

  /**
   * Adds a major tick mark.
   * @param {Number} value
   * @param {Node} labelNode, optional
   */
  EvaporationSliderNode.prototype.addMajorTick = function ( value, labelNode ) {
     this._addTick( MAJOR_TICK_LENGTH, value, labelNode );
  };

  /**
   * Adds a minor tick mark.
   * @param {Number} value
   * @param {Node} labelNode, optional
   */
  EvaporationSliderNode.prototype.addMinorTick = function ( value, labelNode ) {
    this._addTick( MINOR_TICK_LENGTH, value, labelNode );
  };

  /*
   * Adds a tick mark.
   * @param {Number} tickLength
   * @param {Number} value
   * @param {Node} labelNode, optional
   */
  EvaporationSliderNode.prototype._addTick = function ( tickLength, value, labelNode ) {
    var labelX = this._valueToPosition.evaluate( value );
    // ticks
    var tickNode = new Path(
      {
        shape: new Shape()
          .moveTo( labelX, this._trackNode.bottom )
          .lineTo( labelX, this._trackNode.bottom + tickLength ),
        lineWidth: 1,
        stroke: "black"
      } );
    this._ticksParent.addChild( tickNode );
    // label
    if ( labelNode ) {
      this._ticksParent.addChild( labelNode );
      labelNode.centerX = tickNode.centerX;
      labelNode.top = tickNode.bottom + 6;
    }
  };

  return EvaporationSliderNode;
} );