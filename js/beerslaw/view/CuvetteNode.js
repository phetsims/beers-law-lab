// Copyright 2013-2015, University of Colorado Boulder

/**
 * Visual representation of the cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var Color = require( 'SCENERY/util/Color' );
  var FillHighlightListener = require( 'SCENERY_PHET/input/FillHighlightListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Util = require( 'DOT/Util' );
  var Emitter = require( 'AXON/Emitter' );

  // constants
  var PERCENT_FULL = 0.92;
  var SOLUTION_ALPHA = 0.6;
  var ARROW_LENGTH = 110;
  var ARROW_HEAD_HEIGHT = 38;
  var ARROW_HEAD_WIDTH = 45;
  var ARROW_TAIL_WIDTH = 23;
  var ARROW_FILL = Color.ORANGE;

  /**
   * @param {Cuvette} cuvette
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} snapInterval
   * @param {Tandem} tandem
   * @constructor
   */
  function CuvetteNode( cuvette, solutionProperty, modelViewTransform, snapInterval, tandem ) {

    var thisNode = this;
    Node.call( this );

    // nodes
    var cuvetteNode = new Path( null, { stroke: 'black', lineWidth: 3 } );
    var solutionNode = new Rectangle( 0, 0, 1, 1, { lineWidth: 0.5 } );
    var arrowNode = new ArrowNode( -ARROW_LENGTH / 2, 0, ARROW_LENGTH / 2, 0, {
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH,
      headHeight: ARROW_HEAD_HEIGHT,
      doubleHead: true,
      fill: ARROW_FILL,
      stroke: 'black',
      lineWidth: 1
    } );

    // rendering order
    thisNode.addChild( solutionNode );
    thisNode.addChild( cuvetteNode );
    thisNode.addChild( arrowNode );

    // when the cuvette width changes ...
    cuvette.widthProperty.link( function() {
      var width = modelViewTransform.modelToViewDeltaX( cuvette.widthProperty.get() );
      var height = modelViewTransform.modelToViewDeltaY( cuvette.height );
      cuvetteNode.setShape( new Shape().moveTo( 0, 0 ).lineTo( 0, height ).lineTo( width, height ).lineTo( width, 0 ) );
      solutionNode.setRect( 0, 0, width, PERCENT_FULL * height );
      solutionNode.left = cuvetteNode.left;
      solutionNode.bottom = cuvetteNode.bottom;
      arrowNode.x = cuvetteNode.right;
      arrowNode.bottom = cuvetteNode.bottom - 10;
    } );

    // when the fluid color changes ...
    var colorObserver = function( color ) {
      solutionNode.fill = color.withAlpha( SOLUTION_ALPHA );
      solutionNode.stroke = color.darkerColor();
    };
    solutionProperty.get().fluidColorProperty.link( colorObserver );

    // when the solution changes, rewire the color observer
    solutionProperty.link( function( newSolution, oldSolution ) {
      if ( oldSolution ) {
        oldSolution.fluidColorProperty.unlink( colorObserver );
      }
      newSolution.fluidColorProperty.link( colorObserver );
    } );

    // interactivity
    cuvetteNode.pickable = false;
    solutionNode.pickable = false;
    arrowNode.cursor = 'pointer';
    arrowNode.addInputListener( new FillHighlightListener( ARROW_FILL, ARROW_FILL.brighterColor() ) );

    // @public (together)
    this.cuvetteDragHandler = new CuvetteDragHandler( cuvette, modelViewTransform, snapInterval );
    arrowNode.addInputListener( this.cuvetteDragHandler );

    // adjust touch area for the arrow
    var dx = 0.25 * arrowNode.width;
    var dy = 1 * arrowNode.height;
    arrowNode.touchArea = arrowNode.localBounds.dilatedXY( dx, dy );

    // location of the cuvette
    var position = modelViewTransform.modelToViewPosition( cuvette.location );
    thisNode.x = position.x;
    thisNode.y = position.y;

    tandem.addInstance( this );
  }

  beersLawLab.register( 'CuvetteNode', CuvetteNode );

  /**
   * Handler that is attached to the cuvette's drag handle.
   *
   * @param {Cuvette} cuvette
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} snapInterval
   * @constructor
   */
  function CuvetteDragHandler( cuvette, modelViewTransform, snapInterval ) {

    var startX; // x coordinate of mouse click
    var startWidth; // width of the cuvette when the drag started

    var cuvetteDragHandler = this;

    // Emitters for together
    this.startedCallbacksForDragStartedEmitter = new Emitter(); // @private (together)
    this.endedCallbacksForDragStartedEmitter = new Emitter(); // @private (together)

    this.startedCallbacksForDraggedEmitter = new Emitter(); // @private (together)
    this.endedCallbacksForDraggedEmitter = new Emitter(); // @private (together)

    this.startedCallbacksForDragEndedEmitter = new Emitter(); // @private (together)
    this.endedCallbacksForDragEndedEmitter = new Emitter(); // @private (together)

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      start: function( event ) {
        startX = event.pointer.point.x;
        startWidth = cuvette.widthProperty.get();

        cuvetteDragHandler.startedCallbacksForDragStartedEmitter.emit1( cuvette.widthProperty.get() );

        cuvetteDragHandler.endedCallbacksForDragStartedEmitter.emit();
      },

      drag: function( event ) {

        var dragX = event.pointer.point.x;
        var deltaWidth = modelViewTransform.viewToModelDeltaX( dragX - startX );
        var cuvetteWidth = Util.clamp( startWidth + deltaWidth, cuvette.widthRange.min, cuvette.widthRange.max );

        cuvetteDragHandler.startedCallbacksForDraggedEmitter.emit1( cuvetteWidth );

        cuvette.widthProperty.set( cuvetteWidth );

        cuvetteDragHandler.endedCallbacksForDraggedEmitter.emit();
      },

      end: function() {

        var numberOfIntervals = Math.floor( ( cuvette.widthProperty.get() + ( snapInterval / 2 ) ) / snapInterval );

        var newWidth = numberOfIntervals * snapInterval;
        cuvetteDragHandler.startedCallbacksForDragEndedEmitter.emit1( newWidth );

        cuvette.widthProperty.set( newWidth );

        cuvetteDragHandler.endedCallbacksForDragEndedEmitter.emit();
      }
    } );
  }

  beersLawLab.register( 'CuvetteNode.CuvetteDragHandler', CuvetteDragHandler );

  inherit( SimpleDragHandler, CuvetteDragHandler );

  return inherit( Node, CuvetteNode );
} );