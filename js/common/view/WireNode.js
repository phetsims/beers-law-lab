// Copyright 2013, University of Colorado

/**
 * Wire that connects two Movables.
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var Path = require( "SCENERY/nodes/Path" );
  var Range = require( "DOT/Range" );
  var Shape = require( "KITE/Shape" );
  var Vector2 = require( "DOT/Vector2" );

  /**
   *
   * @param {Movable} movable1
   * @param {Movable} movable2
   * @param {Node} node1
   * @param {Node} node2
   * @constructor
   */
  function WireNode( movable1, movable2, node1, node2 ) {

    var thisNode = this;
    Path.call( thisNode, {
      shape: new Shape(),
      stroke: 'gray',
      lineWidth: 8,
      lineCap: "square",
      lineJoin: "round"
    } );

    // The y coordinate of the body's control point varies with the x distance between the body and probe.
    var BODY_CTRL_Y = new LinearFunction( new Range( 0, 800 ), new Range( 0, 200 ) ); // x distance -> y coordinate

    var updateCurve = function() {

      // Connect bottom-center of body to right-center of probe.
      var bodyConnectionPoint = new Vector2( node1.centerX, node1.bottom - 10 );
      var probeConnectionPoint = new Vector2( node2.right, node2.centerY );

      // control points
      var c1Offset = new Vector2( 0, BODY_CTRL_Y.evaluate( node1.centerX - node2.left ) );
      var c2Offset = new Vector2( 50, 0 );
      var c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      thisNode.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    movable1.location.addObserver( updateCurve );
    movable2.location.addObserver( updateCurve );
  }

  inherit( WireNode, Path );

  return WireNode;
});