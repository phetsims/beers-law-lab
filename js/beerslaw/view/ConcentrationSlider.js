// Copyright 2002-2013, University of Colorado Boulder

//TODO This has some things in common with EvaporationSlider, but also subtle differences. It may be more trouble than it's worth to factor out a base class.
/**
 * Slider for changing a solution's concentration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ArrowButton = require( 'common/view/ArrowButton' );
  var BLLFont = require( 'common/BLLFont' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var FillHighlightListener = require( 'SCENERY_PHET/input/FillHighlightListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );

  // track constants
  var TRACK_SIZE = new Dimension2( 200, 15 );

  // thumb constants
  var THUMB_SIZE = new Dimension2( 22, 45 );
  var THUMB_LINE_WIDTH = 1;
  var THUMB_FILL_NORMAL = new Color( 89, 156, 212 );
  var THUMB_FILL_HIGHLIGHT = THUMB_FILL_NORMAL.brighterColor();
  var THUMB_STROKE = Color.BLACK;
  var THUMB_CENTER_LINE_STROKE = Color.WHITE;

  // tick constants
  var TICK_LENGTH = 16;
  var TICK_FONT = new BLLFont( 16 );
  var TICK_DECIMAL_PLACES = 0;

  /**
   * Track that the thumb moves in.
   * Filled with a gradient that matches the solution.
   * Clicking in the track changes the value.
   *
   * @param {Dimension2} trackSize
   * @param {Property<BeersLawSolution>} solution
   * @constructor
   */
  function Track( trackSize, solution ) {

    var thisNode = this;
    Rectangle.call( thisNode, 0, 0, trackSize.width, trackSize.height,
      { cursor: 'pointer', stroke: 'black', lineWidth: 1 } );

    // sync view with model
    var positionToConcentration;
    solution.link( function( solution ) {
      // change the view-to-model function to match the solution's concentration range
      var concentrationRange = solution.concentrationRange;
      positionToConcentration = new LinearFunction( 0, trackSize.width, concentrationRange.min, concentrationRange.max, true /* clamp */ );

      // fill with a gradient that matches the solution's color range
      thisNode.fill = new LinearGradient( 0, 0, trackSize.width, 0 )
        .addColorStop( 0, solution.colorRange.min )
        .addColorStop( 1, solution.colorRange.max );
    } );

    // click in the track to change the value, continue dragging if desired
    var handleEvent = function( event ) {
      var x = thisNode.globalToLocalPoint( event.pointer.point ).x;
      var concentration = positionToConcentration( x );
      solution.get().concentration.set( concentration );
    };
    thisNode.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          handleEvent( event );
        },
        drag: function( event ) {
          handleEvent( event );
        },
        translate: function() {
          // do nothing, override default behavior
        }
      } ) );
  }

  inherit( Rectangle, Track );

  /**
   * Vertical tick line.
   * @constructor
   */
  function TickLine() {
    Path.call( this, { shape: Shape.lineSegment( 0, 0, 0, TICK_LENGTH ), stroke: 'black', lineWidth: 1 } );
  }

  inherit( Path, TickLine );

  /**
   * Tick label.
   * @param {Number} value
   * @constructor
   */
  function TickLabel( value ) {
    var thisNode = this;
    Text.call( thisNode, '?', { font: TICK_FONT, fill: 'black' } );
    thisNode.setValue = function( value ) {
      thisNode.text = value.toFixed( TICK_DECIMAL_PLACES );
    };
    thisNode.setValue( value );
  }

  inherit( Text, TickLabel );

  /**
   * The slider thumb, a rounded rectangle with a vertical line through its center.
   * @param {Dimension2} thumbSize
   * @param {Dimension2} trackSize
   * @param {Property<BeersLawSolution>} solution
   * @constructor
   */
  function Thumb( thumbSize, trackSize, solution ) {

    var thisNode = this;
    Node.call( thisNode, { cursor: 'pointer' } );

    // nodes
    var arcWidth = 0.25 * thumbSize.width;
    var body = new Rectangle( -thumbSize.width / 2, -thumbSize.height / 2, thumbSize.width, thumbSize.height, arcWidth, arcWidth,
      { fill: THUMB_FILL_NORMAL, stroke: THUMB_STROKE, lineWidth: THUMB_LINE_WIDTH } );
    var centerLineYMargin = 3;
    var centerLine = new Path( { shape: Shape.lineSegment( 0, -( thumbSize.height / 2 ) + centerLineYMargin, 0, ( thumbSize.height / 2 ) - centerLineYMargin ),
      stroke: THUMB_CENTER_LINE_STROKE } );

    // rendering order
    thisNode.addChild( body );
    thisNode.addChild( centerLine );

    // interactivity
    body.addInputListener( new FillHighlightListener( THUMB_FILL_NORMAL, THUMB_FILL_HIGHLIGHT ) );

    // touch area
    var dx = 0.25 * thisNode.width;
    var dy = 0.5 * thisNode.height;
    thisNode.touchArea = Shape.rectangle( ( -thisNode.width / 2 ) - dx, ( -thisNode.height / 2 ) - dy, thisNode.width + dx + dx, thisNode.height + dy + dy );

    // set the drag handler and mapping function for the selected solution
    var dragHandler, concentrationToPosition;
    var setSolution = function( solution ) {
      // drag handler with solution's concentration range
      if ( dragHandler ) {
        thisNode.removeInputListener( dragHandler );
      }
      dragHandler = new ThumbDragHandler( thisNode, solution.concentration, new LinearFunction( 0, trackSize.width, solution.concentrationRange.min, solution.concentrationRange.max, true /* clamp */ ) );
      thisNode.addInputListener( dragHandler );

      // linear mapping function with solution's concentration range
      concentrationToPosition = new LinearFunction( solution.concentrationRange.min, solution.concentrationRange.max, 0, trackSize.width, true /* clamp */ );
    };
    setSolution( solution.get() );

    // move the slider thumb to reflect the concentration value
    var concentrationObserver = function( concentration ) {
      thisNode.x = concentrationToPosition( concentration );
    };
    solution.get().concentration.link( concentrationObserver );

    // when the solution changes, wire up to the current solution
    solution.link( function( newSolution, oldSolution ) {
      setSolution( newSolution );
      if ( oldSolution ) {
        oldSolution.concentration.unlink( concentrationObserver );
      }
      newSolution.concentration.link( concentrationObserver );
    } );
  }

  inherit( Node, Thumb );

  /**
   * Drag handler for the slider thumb.
   * @param {Node} dragNode
   * @param {Property<Number>} concentration
   * @param {LinearFunction} positionToValue
   * @constructor
   */
  function ThumbDragHandler( dragNode, concentration, positionToValue ) {
    var clickXOffset; // x-offset between initial click and thumb's origin
    SimpleDragHandler.call( this, {
      allowTouchSnag: true,
      start: function( event ) {
        clickXOffset = dragNode.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
      },
      drag: function( event ) {
        var x = dragNode.globalToParentPoint( event.pointer.point ).x - clickXOffset;
        concentration.set( positionToValue( x ) );
      },
      translate: function() {
        // do nothing, override default behavior
      }
    } );
  }

  inherit( SimpleDragHandler, ThumbDragHandler );

  /**
   * @param {Property<BeersLawSolution>} solution
   * @constructor
   */
  function ConcentrationSlider( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var track = new Track( TRACK_SIZE, solution );
    var thumb = new Thumb( THUMB_SIZE, TRACK_SIZE, solution );
    var minTickLine = new TickLine();
    var maxTickLine = new TickLine();
    var minTickLabel = new TickLabel( 0 ); // correct value will be set when observer is registered
    var maxTickLabel = new TickLabel( 0 ); // correct value will be set when observer is registered

    // buttons for single-unit increments
    var plusButton = new ArrowButton( ArrowButton.Direction.LEFT, function() {
      solution.get().concentration.set( Math.min( solution.get().concentration.get() + solution.get().concentrationTransform.viewToModel( 1 ), solution.get().concentrationRange.max ) );
    } );
    var minusButton = new ArrowButton( ArrowButton.Direction.RIGHT, function() {
      solution.get().concentration.set( Math.max( solution.get().concentration.get() - solution.get().concentrationTransform.viewToModel( 1 ), solution.get().concentrationRange.min ) );
    } );

    // rendering order
    thisNode.addChild( minTickLine );
    thisNode.addChild( maxTickLine );
    thisNode.addChild( minTickLabel );
    thisNode.addChild( maxTickLabel );
    thisNode.addChild( track );
    thisNode.addChild( thumb );
    thisNode.addChild( plusButton );
    thisNode.addChild( minusButton );

    // layout
    minTickLine.left = track.left;
    minTickLine.bottom = track.top;
    minTickLabel.bottom = minTickLine.top - 2;
    maxTickLine.right = track.right;
    maxTickLine.bottom = track.top;
    maxTickLabel.bottom = maxTickLine.top - 2;
    thumb.centerY = track.centerY;
    minusButton.right = track.left - ( thumb.width / 2 ) - 2;
    minusButton.bottom = track.bottom;
    plusButton.left = track.right + ( thumb.width / 2 ) + 2;
    plusButton.bottom = track.bottom;

    var concentrationObserver = function( concentration ) {
      // buttons
      plusButton.setEnabled( concentration < solution.get().concentrationRange.max );
      minusButton.setEnabled( concentration > solution.get().concentrationRange.min );
    };

    // update the tick labels to match the solution
    solution.link( function( solution, oldSolution ) {
      var concentrationRange = solution.concentrationRange;
      var transform = solution.concentrationTransform;
      // update label values
      minTickLabel.setValue( transform.modelToView( concentrationRange.min ) );
      maxTickLabel.setValue( transform.modelToView( concentrationRange.max ) );
      // center values below tick lines
      minTickLabel.centerX = minTickLine.centerX;
      maxTickLabel.centerX = maxTickLine.centerX;
      // re-wire observer
      if ( oldSolution ) {
        oldSolution.concentration.unlink( concentrationObserver );
      }
      solution.concentration.link( concentrationObserver );
    } );
  }

  inherit( Node, ConcentrationSlider );

  return ConcentrationSlider;
} );