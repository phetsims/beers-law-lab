// Copyright 2002-2013, University of Colorado

/**
 * Slider for changing a solution's concentration.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Button = require( "SUN/Button" );
  var Color = require( "common/model/Color" );
  var Dimension2 = require( "DOT/Dimension2" );
  var FillHighlighter = require( "common/view/FillHighlighter" );
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var LinearGradient = require( "SCENERY/util/LinearGradient" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Range = require( "DOT/Range" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Text = require( "SCENERY/nodes/Text" );

  // track constants
  var TRACK_SIZE = new Dimension2( 200, 15 );

  // thumb constants
  var THUMB_SIZE = new Dimension2( 20, 40 );
  var THUMB_LINE_WIDTH = 1;
  var THUMB_FILL_NORMAL = new Color( 89, 156, 212 );
  var THUMB_FILL_HIGHLIGHT = THUMB_FILL_NORMAL.brighter();
  var THUMB_STROKE = Color.BLACK;
  var THUMB_CENTER_LINE_STROKE = Color.WHITE;

  // tick constants
  var TICK_LENGTH = 14;
  var TICK_FONT = "16px Arial";
  var TICK_DECIMAL_PLACES = 0;

  /**
   * Track that the thumb moves in.
   * Filled with a gradient that matches the solution.
   * Clicking in the track changes the value.
   *
   * @param {Dimension2} trackSize
   * @param {Property} solution of type BeersLawSolution
   * @constructor
   */
  function TrackNode( trackSize, solution ) {

    var thisNode = this;
    Rectangle.call( thisNode, 0, 0, trackSize.width, trackSize.height,
                    { cursor: "pointer", stroke: 'black', lineWidth: 1 } );

    // sync view with model
    var viewToModel;
    solution.addObserver( function ( solution ) {
      // change the view-to-model function to match the solution's concentration range
      var concentrationRange = solution.concentrationRange;
      viewToModel = new LinearFunction( new Range( 0, trackSize.width ), new Range( concentrationRange.min, concentrationRange.max ), true /* clamp */ );

      // fill with a gradient that matches the solution's color range
      thisNode.fill = new LinearGradient( 0, 0, trackSize.width, 0 )
        .addColorStop( 0, solution.colorRange.min.toCSS() )
        .addColorStop( 1, solution.colorRange.max.toCSS() );
    } );

    // click in the track to change the value, continue dragging if desired
    var handleEvent = function ( event ) {
      var x = thisNode.globalToLocalPoint( event.pointer.point ).x;
      var concentration = viewToModel.evaluate( x );
      solution.get().concentration.set( concentration );
    };
    thisNode.addInputListener( new SimpleDragHandler(
      {
        start: function ( event ) {
          handleEvent( event );
        },
        drag: function ( event ) {
          handleEvent( event );
        },
        translate: function () {
          // do nothing, override default behavior
        }
      } ) );
  }

  inherit( TrackNode, Rectangle );

  /**
   * Vertical tick line.
   * @constructor
   */
  function TickLineNode() {
    Path.call( this, { shape: Shape.lineSegment( 0, 0, 0, TICK_LENGTH ), stroke: "black", lineWidth: 1 } );
  }

  inherit( TickLineNode, Path );

  /**
   * Tick label.
   * @param value
   * @constructor
   */
  function TickLabelNode( value ) {
    var thisNode = this;
    Text.call( thisNode, "?", { font: TICK_FONT, fill: "black" } );
    thisNode.setValue = function ( value ) {
      thisNode.text = value.toFixed( TICK_DECIMAL_PLACES );
    };
    thisNode.setValue( value );
  }

  inherit( TickLabelNode, Text );

  /**
   * The slider thumb, a rounded rectangle with a vertical line through its center.
   * @param {Dimension2} thumbSize
   * @param {Dimension2} trackSize
   * @param {Property} solution of type BeersLawSolution
   * @constructor
   */
  function ThumbNode( thumbSize, trackSize, solution ) {

    var thisNode = this;
    Node.call( thisNode, { cursor: "pointer" } );

    // nodes
    var arcWidth = 0.25 * thumbSize.width;
    var bodyNode = new Rectangle( -thumbSize.width / 2, -thumbSize.height / 2, thumbSize.width, thumbSize.height, arcWidth, arcWidth,
                                  { fill: THUMB_FILL_NORMAL.toCSS(), stroke: THUMB_STROKE, lineWidth: THUMB_LINE_WIDTH } );
    var centerLineYMargin = 3;
    var centerLineNode = new Path( { shape: Shape.lineSegment( 0, -( thumbSize.height / 2 ) + centerLineYMargin, 0, ( thumbSize.height / 2 ) - centerLineYMargin ),
                                     stroke: THUMB_CENTER_LINE_STROKE.toCSS() } );

    // rendering order
    thisNode.addChild( bodyNode );
    thisNode.addChild( centerLineNode );

    // interactivity
    bodyNode.addInputListener( new FillHighlighter( bodyNode, THUMB_FILL_NORMAL.toCSS(), THUMB_FILL_HIGHLIGHT.toCSS() ) );

    // set the drag handler and mapping function for the selected solution
    var dragHandler, concentrationToPosition;
    var setSolution = function ( solution ) {
      // drag handler with solution's concentration range
      if ( dragHandler ) {
        thisNode.removeInputListener( dragHandler );
      }
      dragHandler = new ThumbDragHandler( thisNode, solution.concentration, new LinearFunction( new Range( 0, trackSize.width ), solution.concentrationRange, true /* clamp */ ) );
      thisNode.addInputListener( dragHandler );

      // linear mapping function with solution's concentration range
      concentrationToPosition = new LinearFunction( solution.concentrationRange, new Range( 0, trackSize.width ), true /* clamp */ );
    };
    setSolution( solution.get() );

    // move the slider thumb to reflect the concentration value
    var concentrationObserver = function ( concentration ) {
      thisNode.x = concentrationToPosition.evaluate( concentration );
    };
    solution.get().concentration.addObserver( concentrationObserver );

    // when the solution changes, wire up to the current solution
    solution.addObserver( function ( newSolution, oldSolution ) {
      setSolution( newSolution );
      if ( oldSolution ) {
        oldSolution.concentration.removeObserver( concentrationObserver );
      }
      newSolution.concentration.addObserver( concentrationObserver );
    } );
  }

  inherit( ThumbNode, Node );

  /**
   * Drag handler for the slider thumb.
   * @param {Node} dragNode
   * @param {Property} concentration of type number
   * @param {LinearFunction} positionToValue
   * @constructor
   */
  function ThumbDragHandler( dragNode, concentration, positionToValue ) {
    var clickXOffset; // x-offset between initial click and thumb's origin
    SimpleDragHandler.call( this, {
      start: function ( event ) {
        clickXOffset = dragNode.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
      },
      drag: function ( event ) {
        var x = dragNode.globalToParentPoint( event.pointer.point ).x - clickXOffset;
        concentration.set( positionToValue.evaluate( x ) );
      },
      translate: function () {
        // do nothing, override default behavior
      }
    } );
  }

  inherit( ThumbDragHandler, SimpleDragHandler );

  /**
   * @param {Property} solution of type BeersLawSolution
   * @constructor
   */
  function ConcentrationSliderNode( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var trackNode = new TrackNode( TRACK_SIZE, solution );
    var thumbNode = new ThumbNode( THUMB_SIZE, TRACK_SIZE, solution );
    var minTickLineNode = new TickLineNode();
    var maxTickLineNode = new TickLineNode();
    var minTickLabelNode = new TickLabelNode( 0 ); // correct value will be set when observer is registered
    var maxTickLabelNode = new TickLabelNode( 0 ); // correct value will be set when observer is registered

    // buttons for single-unit increments
    var plusButton = new Button( new Path( { fill: "black", shape: new Shape().moveTo( 0, 0 ).lineTo( 20, 10 ).lineTo( 0, 20 ).close() } ),
                                 function () {
                                   solution.get().concentration.set( solution.get().concentration.get() + solution.get().concentrationTransform.viewToModel( 1 ) );
                                 }, { cornerRadius: 4 } );
    var minusButton = new Button( new Path( { fill: "black", shape: new Shape().moveTo( 0, 10 ).lineTo( 20, 0 ).lineTo( 20, 20 ).close() } ),
                                  function () {
                                    solution.get().concentration.set( solution.get().concentration.get() - solution.get().concentrationTransform.viewToModel( 1 ) );
                                  }, { cornerRadius: 4 } );

    // rendering order
    thisNode.addChild( minTickLineNode );
    thisNode.addChild( maxTickLineNode );
    thisNode.addChild( minTickLabelNode );
    thisNode.addChild( maxTickLabelNode );
    thisNode.addChild( trackNode );
    thisNode.addChild( thumbNode );
    thisNode.addChild( plusButton );
    thisNode.addChild( minusButton );

    // layout
    minTickLineNode.left = trackNode.left;
    minTickLineNode.bottom = trackNode.top;
    minTickLabelNode.bottom = minTickLineNode.top - 2;
    maxTickLineNode.right = trackNode.right;
    maxTickLineNode.bottom = trackNode.top;
    maxTickLabelNode.bottom = maxTickLineNode.top - 2;
    thumbNode.centerY = trackNode.centerY;
    minusButton.right = trackNode.left - ( thumbNode.width / 2 ) - 2;
    minusButton.bottom = trackNode.bottom;
    plusButton.left = trackNode.right + ( thumbNode.width / 2 ) + 2;
    plusButton.bottom = trackNode.bottom;

    var concentrationObserver = function ( concentration ) {
      //TODO better to disable these button than hide them, but not supported by sun.Button yet
      // buttons
      plusButton.visible = ( concentration < solution.get().concentrationRange.max );
      minusButton.visible = ( concentration > solution.get().concentrationRange.min );
    };

    // update the tick labels to match the solution
    solution.addObserver( function ( solution, oldSolution ) {
      var concentrationRange = solution.concentrationRange;
      var transform = solution.concentrationTransform;
      // update label values
      minTickLabelNode.setValue( transform.modelToView( concentrationRange.min ) );
      maxTickLabelNode.setValue( transform.modelToView( concentrationRange.max ) );
      // center values below tick lines
      minTickLabelNode.centerX = minTickLineNode.centerX;
      maxTickLabelNode.centerX = maxTickLineNode.centerX;
      //TODO better to disable these button than hide them, but not supported by sun.Button yet
      // buttons
      plusButton.visible = ( solution.concentration.get() < concentrationRange.max );
      minusButton.visible = ( solution.concentration.get() > concentrationRange.min );
      // re-wire observer
      if ( oldSolution ) {
        oldSolution.concentration.removeObserver( concentrationObserver );
      }
      solution.concentration.addObserver( concentrationObserver );
    } );


  }

  inherit( ConcentrationSliderNode, Node );

  return ConcentrationSliderNode;
} );