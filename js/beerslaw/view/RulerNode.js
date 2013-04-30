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
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

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
                                      { fill: options.backgroundFill, stroke: options.backgroundStroke } ) );
  }

  inherit( RulerNode, Node );

  return RulerNode;
} );
