// Copyright 2002-2013, University of Colorado

/**
 * Horizontal slider, snaps to min when released.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var Range = require( "PHETCOMMON/math/Range" );
  var MathUtil = require( "PHETCOMMON/math/MathUtil" );
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Dimension2 = require( "DOT/Dimension2" );
  var Shape = require( "KITE/Shape" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Text = require( "SCENERY/nodes/Text" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var LinearFunction = require( "common/util/LinearFunction" );

  // constants
  var KNOB_SIZE = new Dimension2( 15, 30 );
  var MAJOR_TICK_LENGTH = 20;
  var MINOR_TICK_LENGTH = 15;
  var KNOB_FILL_ENABLED = "3399FF";
  var KNOB_FILL_DISABLED = "#F0F0F0";

  /**
   * @param {Range} range
   * @param {Dimension2} trackSize
   * @param {Property} value (type number)
   * @param {Property} enabled (type Boolean)
   * @param {Boolean} snapToMinWhenReleased
   * @constructor
   */
  function SliderNode( range, trackSize, value, enabled, snapToMinWhenReleased ) {

    var thisNode = this;
    Node.call( thisNode );

    // ticks are added to this parent, so they are behind knob
    thisNode._ticksParent = new Node();
    thisNode.addChild( thisNode._ticksParent );

    // track
    thisNode._trackNode = new Path(
      {
        shape: Shape.rect( 0, 0, trackSize.width, trackSize.height ),
        fill: 'white',
        stroke: 'black',
        lineWidth: 1
      } );
    thisNode.addChild( this._trackNode );

    // knob
    var knobNode = new Path(
      {
        cursor: "pointer",
        shape: new Shape()
          .moveTo( -KNOB_SIZE.width / 2, 0 )
          .lineTo( KNOB_SIZE.width / 2, 0 )
          .lineTo( KNOB_SIZE.width / 2, 0.65 * KNOB_SIZE.height )
          .lineTo( 0, KNOB_SIZE.height )
          .lineTo( -KNOB_SIZE.width / 2, 0.65 * KNOB_SIZE.height )
          .close(),
        fill: KNOB_FILL_ENABLED,
        stroke: 'black',
        lineWidth: 1
      } );
    knobNode.centerY = thisNode._trackNode.centerY;
    thisNode.addChild( knobNode );

    // enable/disable knob
    enabled.addObserver( function ( enabled ) {
      knobNode.fill = enabled ? KNOB_FILL_ENABLED : KNOB_FILL_DISABLED;
      knobNode.cursor = enabled ? "pointer" : "default";
    } );

    // mapping between value and track position
    thisNode._valueToPosition = new LinearFunction( range, new Range( 0, trackSize.width ) );

    // move knob when value changes
    value.addObserver( function ( value ) {
      knobNode.centerX = thisNode._valueToPosition.evaluate( value );
    } );

    // update value when knob is dragged
    knobNode.addInputListener( new SimpleDragHandler(
      {
        drag: function ( event, trail ) {
          if ( enabled.get() ) {
            var localPosition = trail.getTransform().inversePosition2( event.pointer.point ); // global to local
            value.set( MathUtil.clamp( thisNode._valueToPosition.evaluateInverse( localPosition.x ), range.min, range.max ) );
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

    // update knob location when value changes
    value.addObserver( function( value ) {
       knobNode.centerX = thisNode._valueToPosition.evaluate( value );
    } );
  }

  Inheritance.inheritPrototype( SliderNode, Node );

  /**
   * Adds a major tick mark.
   * @param {Number} value
   * @param {Node} labelNode, optional
   */
  SliderNode.prototype.addMajorTick = function ( value, labelNode ) {
     this._addTick( MAJOR_TICK_LENGTH, value, labelNode );
  };

  /**
   * Adds a minor tick mark.
   * @param {Number} value
   * @param {Node} labelNode, optional
   */
  SliderNode.prototype.addMinorTick = function ( value, labelNode ) {
    this._addTick( MINOR_TICK_LENGTH, value, labelNode );
  };

  /*
   * Adds a tick mark.
   * @param {Number} tickLength
   * @param {Number} value
   * @param {Node} labelNode, optional
   */
  SliderNode.prototype._addTick = function ( tickLength, value, labelNode ) {
    var labelX = this._valueToPosition.evaluate( value );
    // ticks
    var tickNode = new Path(
      {
        shape: new Shape()
          .moveTo( labelX, this._trackNode.bottom )
          .lineTo( labelX, this._trackNode.bottom + tickLength ),
        lineWidth: 2,
        stroke: 'black'
      } );
    this._ticksParent.addChild( tickNode );
    // label
    if ( labelNode ) {
      this._ticksParent.addChild( labelNode );
      labelNode.centerX = tickNode.centerX;
      labelNode.top = tickNode.bottom + 6;
    }
  };

  return SliderNode;
} );