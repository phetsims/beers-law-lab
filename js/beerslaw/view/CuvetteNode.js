// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of the cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'beers-law-lab' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var FillHighlightListener = require( 'SCENERY_PHET/input/FillHighlightListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Util = require( 'DOT/Util' );

  // constants
  var PERCENT_FULL = 0.92;
  var SOLUTION_ALPHA = 0.6;
  var ARROW_LENGTH = 110;
  var ARROW_HEAD_LENGTH = 38;
  var ARROW_HEAD_WIDTH = 45;
  var ARROW_TAIL_WIDTH = 23;
  var ARROW_FILL = Color.ORANGE;

  /**
   * Handler that is attached to the cuvette's drag handle.
   * @param {Node} cuvetteNode
   * @param {Cuvette} cuvette
   * @param {ModelViewTransform2} mvt
   * @param {Number} snapInterval
   * @constructor
   */
  function CuvetteDragHandler( cuvetteNode, cuvette, mvt, snapInterval ) {

    var startX; // x coordinate of mouse click
    var startWidth; // width of the cuvette when the drag started

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      start: function( event ) {
        startX = event.pointer.point.x;
        startWidth = cuvette.width.get();
      },

      drag: function( event, trail ) {
        var dragX = event.pointer.point.x;
        var deltaWidth = mvt.viewToModelDeltaX( dragX - startX );
        var cuvetteWidth = Util.clamp( startWidth + deltaWidth, cuvette.widthRange.min, cuvette.widthRange.max );
        cuvette.width.set( cuvetteWidth );
      },

      end: function( event ) {
        var numberOfIntervals = Math.floor( ( cuvette.width.get() + ( snapInterval / 2 ) ) / snapInterval );
        cuvette.width.set( numberOfIntervals * snapInterval );
      },

      translate: function() {
        // override default behavior, do nothing
      }
    } );
  }

  inherit( SimpleDragHandler, CuvetteDragHandler );

  /**
   * @param {Cuvette} cuvette
   * @param {Property<BeersLawSolution>} solution
   * @param {ModelViewTransform2} mvt
   * @param {Number} snapInterval
   * @constructor
   */
  function CuvetteNode( cuvette, solution, mvt, snapInterval ) {

    var thisNode = this;
    Node.call( this );

    // A double-headed arrow, pointing left and right. Path definition starts at left tip and moves clockwise.
    assert && assert( ARROW_HEAD_WIDTH > ARROW_TAIL_WIDTH );
    assert && assert( ARROW_LENGTH > 2 * ARROW_HEAD_LENGTH );
    var arrowShape = new Shape()
      .moveTo( -ARROW_LENGTH / 2, 0 )
      .lineTo( -ARROW_LENGTH / 2 + ARROW_HEAD_LENGTH, -ARROW_HEAD_WIDTH / 2 )
      .lineTo( -ARROW_LENGTH / 2 + ARROW_HEAD_LENGTH, -ARROW_TAIL_WIDTH / 2 )
      .lineTo( ARROW_LENGTH / 2 - ARROW_HEAD_LENGTH, -ARROW_TAIL_WIDTH / 2 )
      .lineTo( ARROW_LENGTH / 2 - ARROW_HEAD_LENGTH, -ARROW_HEAD_WIDTH / 2 )
      .lineTo( ARROW_LENGTH / 2, 0 )
      .lineTo( ARROW_LENGTH / 2 - ARROW_HEAD_LENGTH, ARROW_HEAD_WIDTH / 2 )
      .lineTo( ARROW_LENGTH / 2 - ARROW_HEAD_LENGTH, ARROW_TAIL_WIDTH / 2 )
      .lineTo( -ARROW_LENGTH / 2 + ARROW_HEAD_LENGTH, ARROW_TAIL_WIDTH / 2 )
      .lineTo( -ARROW_LENGTH / 2 + ARROW_HEAD_LENGTH, ARROW_HEAD_WIDTH / 2 )
      .close();

    // nodes
    var cuvetteNode = new Path( { stroke: 'black', lineWidth: 3 } );
    var solutionNode = new Rectangle( 0, 0, 1, 1, { lineWidth: 0.5 } );
    var arrowNode = new Path( { shape: arrowShape, fill: ARROW_FILL, stroke: 'black', lineWidth: 1 } );

    // rendering order
    thisNode.addChild( solutionNode );
    thisNode.addChild( cuvetteNode );
    thisNode.addChild( arrowNode );

    // when the cuvette width changes ...
    cuvette.width.link( function() {
      var width = mvt.modelToViewDeltaX( cuvette.width.get() );
      var height = mvt.modelToViewDeltaY( cuvette.height );
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
    solution.get().fluidColor.link( colorObserver );

    // when the solution changes, rewire the color observer
    solution.link( function( newSolution, oldSolution ) {
      if ( oldSolution ) {
        oldSolution.fluidColor.unlink( colorObserver );
      }
      newSolution.fluidColor.link( colorObserver );
    } );

    // interactivity
    cuvetteNode.pickable = false;
    solutionNode.pickable = false;
    arrowNode.cursor = 'pointer';
    arrowNode.addInputListener( new FillHighlightListener( ARROW_FILL, ARROW_FILL.brighterColor() ) );
    arrowNode.addInputListener( new CuvetteDragHandler( thisNode, cuvette, mvt, snapInterval ) );

    // adjust touch area for the arrow
    var arrowBounds = arrowShape.computeBounds().copy();
    var dx = 0.25 * arrowBounds.width;
    var dy = 1 * arrowBounds.height;
    arrowNode.touchArea = Shape.rectangle( arrowBounds.minX - dx, arrowBounds.minY - dy, arrowBounds.width + ( 2 * dx ), arrowBounds.height + ( 2 * dy ) );

    // location of the cuvette
    var position = mvt.modelToViewPosition( cuvette.location );
    thisNode.x = position.x;
    thisNode.y = position.y;
  }

  inherit( Node, CuvetteNode );

  return CuvetteNode;
} );