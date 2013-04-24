// Copyright 2002-2013, University of Colorado

/**
 * Visual representation of the cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var Color = require( "common/model/Color" );
  var FillHighlightHandler = require( "common/view/FillHighlightHandler" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );

  // constants
  var PERCENT_FULL = 0.92;
  var SOLUTION_ALPHA = 150;
  var ARROW_LENGTH = 80;
  var ARROW_HEAD_LENGTH = 25;
  var ARROW_HEAD_WIDTH = 30;
  var ARROW_TAIL_WIDTH = 15;
  var ARROW_FILL = Color.ORANGE;

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
    var widthHandleNode = new Rectangle( -ARROW_LENGTH / 2, -ARROW_HEAD_WIDTH / 2, ARROW_LENGTH, ARROW_HEAD_WIDTH,
                                         { fill: ARROW_FILL.toCSS(), stroke: 'black', lineWidth: 1  } )

    // rendering order
    thisNode.addChild( solutionNode );
    thisNode.addChild( cuvetteNode );
    thisNode.addChild( widthHandleNode );

    // when the cuvette width changes ...
    cuvette.width.addObserver( function () {
      var width = mvt.modelToView( cuvette.width.get() );
      var height = mvt.modelToView( cuvette.height );
      cuvetteNode.setShape( new Shape().moveTo( 0, 0 ).lineTo( 0, height ).lineTo( width, height ).lineTo( width, 0 ) );
      solutionNode.setShape( Shape.rect( 0, 0, width, PERCENT_FULL * height ) );
      solutionNode.left = cuvetteNode.left;
      solutionNode.bottom = cuvetteNode.bottom;
      widthHandleNode.x = cuvetteNode.right;
      widthHandleNode.y = 0.85 * cuvetteNode.bottom;
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

    // handle interactivity
    widthHandleNode.cursor = "pointer";
    widthHandleNode.addInputListener( new FillHighlightHandler( widthHandleNode, ARROW_FILL.toCSS(), ARROW_FILL.brighter().toCSS() ) );
    widthHandleNode.addInputListener( new SimpleDragHandler(
      {
        start: function () {
          console.log( "start" );//XXX
        },
        end: function () {
          console.log( "end" );//XXX
        },
        drag: function () {
          console.log( "drag" );//XXX
        },
        translate: function () {
        }
      } ) );

    // location of the cuvette
    var position = mvt.modelToView( cuvette.location );
    thisNode.x = position.x;
    thisNode.y = position.y;
  }

  inherit( CuvetteNode, Node );

  return CuvetteNode;
} );


//        widthHandleNode.addInputEventListener( new WidthDragHandler( this, cuvette, mvt, snapInterval ) );
//    }
//
//    // Drag handler for manipulating the cuvette's width
//    private static class WidthDragHandler extends SimSharingDragHandler {
//
//        private final Cuvette cuvette;
//        private final CuvetteNode cuvetteNode;
//        private final ModelViewTransform mvt;
//        private final double snapInterval;
//
//        private double startXOffset; // x offset of mouse click from cuvette's origin
//        private double startWidth; // width of the cuvette when the drag started
//
//        public WidthDragHandler( CuvetteNode cuvetteNode, Cuvette cuvette, ModelViewTransform mvt, double snapInterval ) {
//            super( UserComponents.cuvetteWidthHandle, UserComponentTypes.sprite );
//            this.cuvette = cuvette;
//            this.cuvetteNode = cuvetteNode;
//            this.mvt = mvt;
//            this.snapInterval = snapInterval;
//        }
//
//        @Override protected void startDrag( PInputEvent event ) {
//            super.startDrag( event );
//            startXOffset = event.getPositionRelativeTo( cuvetteNode ).getX();
//            startWidth = cuvette.width.get();
//        }
//
//        @Override protected void drag( PInputEvent event ) {
//            super.drag( event );
//            double dragXOffset = event.getPositionRelativeTo( cuvetteNode ).getX();
//            double deltaWidth = mvt.viewToModelDeltaX( dragXOffset - startXOffset );
//            double cuvetteWidth = MathUtil.clamp( startWidth + deltaWidth, cuvette.widthRange );
//            cuvette.width.set( cuvetteWidth );
//        }
//
//        // snap to the closest value
//        @Override protected void endDrag( PInputEvent event ) {
//            super.endDrag( event );
//            int numberOfIntervals = (int) ( ( cuvette.width.get() + ( snapInterval / 2 ) ) / snapInterval );
//            cuvette.width.set( numberOfIntervals * snapInterval );
//        }
//    }
//}
