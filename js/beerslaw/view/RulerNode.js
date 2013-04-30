// Copyright 2013, University of Colorado

/**
 * Visual representation of a ruler.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var assert = require( 'ASSERT/assert' )( 'beers-law-lab' );   //TODO BLL specific
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );

  function RulerNode( width, height, majorTickLabels, units, options ) {

    options = _.extend(
      {
        // body of the ruler
        backgroundFill: "rgb(236, 225, 113)",
        backgroundStroke: "black",
        backgroundLineWidth: 1,
        insetsWidth: 14,
        // major tick options
        majorTickFont: "18px Arial",
        majorTickHeightRatio: 0.4,
        majorTickStroke: "black",
        majorTickLineWidth: 1,
        // minor tick options
        minorTickFont: "18px Arial",
        minorTickHeightRatio: 0.2,
        minorTickStroke: "black",
        minorTickLineWidth: 1,
        // units options
        unitsFont: "18px Arial",
        unitsMajorTickIndex: 0, // units will be place to the right of this major tick
        unitsSpacing: 3
      }, options );

    assert && assert( options.unitsMajorTickIndex < majorTickLabels.length );

    var thisNode = this;
    Node.call( thisNode, options );

    // background
    thisNode.addChild( new Rectangle( 0, 0, width, height,
                                      { fill: options.backgroundFill,
                                        stroke: options.backgroundStroke,
                                        lineWidth: options.backgroundLineWidth } ) );
  }

  inherit( RulerNode, Node );

  /**
   * Creates a tick mark at a specific x location.
   * Each tick is marked at the top and bottom of the ruler.
   * If you desire a different style of tick mark, override this method.
   *
   * @param x
   * @param rulerHeight
   * @param tickHeight
   * @param stroke
   * @param lineWidth
   * @return {Node}
   */
  RulerNode.prototype.createTickMarkNode = function ( x, rulerHeight, tickHeight, stroke, lineWidth ) {
    var shape = new Shape().moveTo( x, 0 ).lineTo( x, tickHeight ).moveTo( x, rulerHeight - tickHeight ).lineTo( x, rulerHeight );
    return new Path( { stroke: stroke, lineWidth: lineWidth, shape: shape } );
  };

  return RulerNode;
} );
