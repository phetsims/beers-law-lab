// Copyright 2013, University of Colorado

/**
 * Indicator that the solution is saturated.
 * This consists of "Saturated!" on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var Color = require( "common/model/Color" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {ConcentrationSolution} solution
   * @constructor
   */
  function SaturatedIndicatorNode( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    var textNode = new Text( BLLStrings.saturated, { font: "20px Arial" } );

    // translucent light-gray background, so this shows up on all solution colors
    var backgroundNode = new Rectangle( 0, 0, 1.2 * textNode.width, 1.2 * textNode.height, 8, 8,
                                        { fill: new Color( 240, 240, 240, 0.6 ).toCSS() } );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( textNode );

    // layout
    textNode.centerX = backgroundNode.centerX;
    textNode.centerY = backgroundNode.centerY;

    // make this node visible when the solution is saturated
    solution.concentration.addObserver( function () {
      thisNode.setVisible( solution.isSaturated() );
    } );
  }

  inherit( SaturatedIndicatorNode, Node );

  return SaturatedIndicatorNode;
} );