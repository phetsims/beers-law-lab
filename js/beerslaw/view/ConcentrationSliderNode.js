// Copyright 2013, University of Colorado

/**
 * Slider for changing a solution's concentration.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
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
  var THUMB_SIZE = new Dimension2( 15, 35 );
  var THUMB_LINE_WIDTH = 1;
  var THUMB_FILL_NORMAL = new Color( 89, 156, 212 );
  var THUMB_FILL_HIGHLIGHT = THUMB_FILL_NORMAL.brighter();
  var THUMB_STROKE = Color.BLACK;
  var THUMB_CENTER_LINE_STROKE = Color.WHITE;

  // tick constants
  var TICK_LENGTH = 8;
  var TICK_FONT = "12px Arial";
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

    // sets the drag handler and mapping function for the selected solution
    var dragHandler, concentrationToPosition;
    var setSolution = function ( solution ) {
      // drag handler with solution's concentration range
      if ( dragHandler != null ) {
        thisNode.removeInputListener( dragHandler );
      }
      dragHandler = {}; // TODO
      thisNode.addInputListener( dragHandler );

      // linear mapping function with solution's concentration range
      concentrationToPosition = new LinearFunction( solution.concentrationRange, new Range( 0, trackSize.width ), true /* clamp */ );
    };
    setSolution( solution.get() );

    // move the slider thumb to reflect the concentration value
    var concentrationObserver = function ( value ) {
      thisNode.x = concentrationToPosition.evaluate( value );
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

    // rendering order
    thisNode.addChild( minTickLineNode );
    thisNode.addChild( maxTickLineNode );
    thisNode.addChild( minTickLabelNode );
    thisNode.addChild( maxTickLabelNode );
    thisNode.addChild( trackNode );
    thisNode.addChild( thumbNode );

    // layout
    minTickLineNode.left = trackNode.left;
    minTickLineNode.top = trackNode.bottom;
    minTickLabelNode.top = minTickLineNode.bottom + 2;
    maxTickLineNode.right = trackNode.right;
    maxTickLineNode.top = trackNode.bottom;
    maxTickLabelNode.top = maxTickLineNode.bottom + 2;
    thumbNode.centerX = trackNode.centerX;
    thumbNode.centerY = trackNode.centerY;

    // update the tick labels to match the solution
    solution.addObserver( function ( solution ) {
      var concentrationRange = solution.concentrationRange;
      var transform = solution.concentrationTransform;
      // update label values
      minTickLabelNode.setValue( transform.modelToView( concentrationRange.min ) );
      maxTickLabelNode.setValue( transform.modelToView( concentrationRange.max ) );
      // center values below tick lines
      minTickLabelNode.centerX = minTickLineNode.centerX;
      maxTickLabelNode.centerX = maxTickLineNode.centerX;
    } );
  }

  inherit( ConcentrationSliderNode, Node );

  return ConcentrationSliderNode;
} );

//
//    // The slider thumb, a rounded rectangle with a vertical line through its center. Origin is at the thumb's geometric center.
//    private static class ThumbNode extends PComposite {
//
//        private Function modelToView;
//        private ThumbDragHandler dragHandler;
//
//        public ThumbNode( final IUserComponent userComponent, final PDimension thumbSize, final PDimension trackSize,
//                          final PNode relativeNode, final PNode trackNode, final Property<BeersLawSolution> solution ) {
//
//            PPath bodyNode = new PPath() {{
//                final double arcWidth = 0.25 * thumbSize.getWidth();
//                setPathTo( new RoundRectangle2D.Double( -thumbSize.getWidth() / 2, -thumbSize.getHeight() / 2, thumbSize.getWidth(), thumbSize.getHeight(), arcWidth, arcWidth ) );
//                setPaint( THUMB_NORMAL_COLOR );
//                setStroke( THUMB_STROKE );
//                setStrokePaint( THUMB_STROKE_COLOR );
//            }};
//
//            PPath centerLineNode = new PPath() {{
//                setPathTo( new Line2D.Double( 0, -( thumbSize.getHeight() / 2 ) + 3, 0, ( thumbSize.getHeight() / 2 ) - 3 ) );
//                setStrokePaint( THUMB_CENTER_LINE_COLOR );
//            }};
//
//            // rendering order
//            addChild( bodyNode );
//            addChild( centerLineNode );
//
//            addInputEventListener( new CursorHandler() );
//            addInputEventListener( new PaintHighlightHandler( bodyNode, THUMB_NORMAL_COLOR, THUMB_HIGHLIGHT_COLOR ) );
//
//            // configure for a specific solution
//            final VoidFunction1<BeersLawSolution> setSolution = new VoidFunction1<BeersLawSolution>() {
//                public void apply( BeersLawSolution solution ) {
//
//                    // drag handler with solution's concentration range
//                    if ( dragHandler != null ) {
//                        removeInputEventListener( dragHandler );
//                    }
//                    dragHandler = new ThumbDragHandler( userComponent, relativeNode, trackNode, ThumbNode.this, solution.concentrationRange, solution.concentration );
//                    addInputEventListener( dragHandler );
//
//                    // model-to-view function with solution's concentration range
//                    modelToView = new LinearFunction( solution.concentrationRange.getMin(), solution.concentrationRange.getMax(), 0, trackSize.getWidth() );
//                }
//            };
//            setSolution.apply( solution.get() );
//
//            // move the slider thumb to reflect the concentration value
//            final VoidFunction1<Double> concentrationObserver = new VoidFunction1<Double>() {
//                public void apply( Double value ) {
//                    setOffset( modelToView.evaluate( value ), getYOffset() );
//                }
//            };
//            solution.get().concentration.addObserver( concentrationObserver );
//
//            // when the solution changes, wire up to the current solution
//            solution.addObserver( new ChangeObserver<BeersLawSolution>() {
//                public void update( BeersLawSolution newSolution, BeersLawSolution oldSolution ) {
//                    setSolution.apply( newSolution );
//                    oldSolution.concentration.removeObserver( concentrationObserver );
//                    newSolution.concentration.addObserver( concentrationObserver );
//                }
//            } );
//        }
//    }
//
//    // Drag handler for the slider thumb, with data collection support.
//    private static class ThumbDragHandler extends SliderThumbDragHandler {
//
//        private final Property<Double> modelValue;
//
//        public ThumbDragHandler( IUserComponent userComponent, PNode relativeNode, PNode trackNode, PNode thumbNode,
//                                 DoubleRange range, final Property<Double> modelValue ) {
//            super( userComponent, false, Orientation.HORIZONTAL, relativeNode, trackNode, thumbNode, range,
//                   new VoidFunction1<Double>() {
//                       public void apply( Double value ) {
//                           modelValue.set( value );
//                       }
//                   } );
//            this.modelValue = modelValue;
//        }
//
//        @Override protected ParameterSet getParametersForAllEvents( PInputEvent event ) {
//            return super.getParametersForAllEvents( event ).with( ParameterKeys.value, modelValue.get() );
//        }
//    }
//}
