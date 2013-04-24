// Copyright 2002-2013, University of Colorado

/**
 * Visual representation of the cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var Color = require( "common/model/Color" );
  var FillHighlighter = require( "common/view/FillHighlighter" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Util = require( "DOT/Util" );

  // constants
  var PERCENT_FULL = 0.92;
  var SOLUTION_ALPHA = 150;
  var ARROW_LENGTH = 80;
  var ARROW_HEAD_LENGTH = 25;
  var ARROW_HEAD_WIDTH = 30;
  var ARROW_TAIL_WIDTH = 15;
  var ARROW_FILL = Color.ORANGE;

  /**
   * Handler that is attached to the cuvette's drag handle.
   * @param {Node} cuvetteNode
   * @param {Cuvette} cuvette
   * @param {ModelViewTransform2D} mvt
   * @param {Number} snapInterval
   * @constructor
   */
  function CuvetteDragHandler( cuvetteNode, cuvette, mvt, snapInterval ) {

    var startX; // x coordinate of mouse click
    var startWidth; // width of the cuvette when the drag started

    SimpleDragHandler.call( this, {
      start: function ( event ) {
        startX = event.pointer.point.x;
        startWidth = cuvette.width.get();
      },
      drag: function ( event, trail ) {
        var dragX = event.pointer.point.x;
        var deltaWidth = mvt.viewToModel( dragX - startX );
        var cuvetteWidth = Util.clamp( startWidth + deltaWidth, cuvette.widthRange.min, cuvette.widthRange.max );
        cuvette.width.set( cuvetteWidth );
      },
      end: function ( event ) {
        var numberOfIntervals = Math.floor( ( cuvette.width.get() + ( snapInterval / 2 ) ) / snapInterval );
        cuvette.width.set( numberOfIntervals * snapInterval );
      },
      translate: function () {
        // override default behavior, do nothing
      }
    } );
  }

  inherit( CuvetteDragHandler, SimpleDragHandler );

  /**
   * @param {Cuvette} cuvette
   * @param {Property} solution of type BeersLawSolution
   * @param {ModelViewTransform2D} mvt
   * @param {Number} snapInterval
   * @constructor
   */
  function CuvetteNode( cuvette, solution, mvt, snapInterval ) {

    var thisNode = this;
    Node.call( this );

    // nodes
    var cuvetteNode = new Path( { stroke: 'black', lineWidth: 3 } );
    var solutionNode = new Path( { lineWidth: 0.25 } );
    var arrowNode = new Rectangle( -ARROW_LENGTH / 2, -ARROW_HEAD_WIDTH / 2, ARROW_LENGTH, ARROW_HEAD_WIDTH,
                                   { fill: ARROW_FILL.toCSS(), stroke: 'black', lineWidth: 1  } )

    // rendering order
    thisNode.addChild( solutionNode );
    thisNode.addChild( cuvetteNode );
    thisNode.addChild( arrowNode );

    // when the cuvette width changes ...
    cuvette.width.addObserver( function () {
      var width = mvt.modelToView( cuvette.width.get() );
      var height = mvt.modelToView( cuvette.height );
      cuvetteNode.setShape( new Shape().moveTo( 0, 0 ).lineTo( 0, height ).lineTo( width, height ).lineTo( width, 0 ) );
      solutionNode.setShape( Shape.rect( 0, 0, width, PERCENT_FULL * height ) );
      solutionNode.left = cuvetteNode.left;
      solutionNode.bottom = cuvetteNode.bottom;
      arrowNode.x = cuvetteNode.right;
      arrowNode.y = 0.85 * cuvetteNode.bottom;
    } );

    // when the fluid color changes ...
    var colorObserver = function ( color ) {
      solutionNode.fill = Color.withAlpha( color, SOLUTION_ALPHA ).toCSS();
      solutionNode.stroke = color.darker().toCSS();
    };
    solution.get().fluidColor.addObserver( colorObserver );

    // when the solution changes, rewire the color observer
    solution.addObserver( function ( newSolution, oldSolution ) {
      if ( oldSolution ) {
        oldSolution.fluidColor.removeObserver( colorObserver );
      }
      newSolution.fluidColor.addObserver( colorObserver );
    } );

    // interactivity
    arrowNode.cursor = "pointer";
    arrowNode.addInputListener( new FillHighlighter( arrowNode, ARROW_FILL.toCSS(), ARROW_FILL.brighter().toCSS() ) );
    arrowNode.addInputListener( new CuvetteDragHandler( thisNode, cuvette, mvt, snapInterval ) );

    // location of the cuvette
    var position = mvt.modelToView( cuvette.location );
    thisNode.x = position.x;
    thisNode.y = position.y;
  }

  inherit( CuvetteNode, Node );

  return CuvetteNode;
} );