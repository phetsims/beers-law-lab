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
  var TICK_LENGTH = 20;

  /**
   * @param {Range} range
   * @param {Dimension2} trackSize
   * @param {Property} value (type number)
   * @param {Property} enabled (type Boolean)
   * @constructor
   */
  function SliderNode( range, trackSize, value, enabled ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode._ticksParent = new Node();
    thisNode.addChild( thisNode._ticksParent );

    thisNode._trackNode = new Path(
      {
        shape: Shape.rect( 0, 0, trackSize.width, trackSize.height ),
        fill: 'gray',
        stroke: 'black',
        lineWidth: 1
      } );
    thisNode.addChild( this._trackNode );

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
        fill: 'red',
        stroke: 'black',
        lineWidth: 1
      } );
    knobNode.centerY = thisNode._trackNode.centerY;
    thisNode.addChild( knobNode );

    enabled.addObserver( function ( enabled ) {
      knobNode.fill = enabled ? 'red' : '#F0F0F0';
      knobNode.cursor = enabled ? "pointer" : "default";
    } );

    thisNode._valueToPosition = new LinearFunction( range, new Range( 0, trackSize.width ) );

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
          value.set( range.min );
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

  SliderNode.prototype.addLabel = function ( value, labelNode ) {
    var labelX = this._valueToPosition.evaluate( value );
    var tickNode = new Path(
      {
        shape: new Shape()
          .moveTo( labelX, this._trackNode.bottom )
          .lineTo( labelX, this._trackNode.bottom + TICK_LENGTH ),
        lineWidth: 2,
        stroke: 'black'
      } );
    this._ticksParent.addChild( tickNode );
    this._ticksParent.addChild( labelNode );
    labelNode.centerX = tickNode.centerX;
    labelNode.top = tickNode.bottom + 6;
  };

  return SliderNode;
} );