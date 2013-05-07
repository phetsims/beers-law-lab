// Copyright 2002-2013, University of Colorado

/**
 * Visual representation of the ruler.
 * This is a wrapper around the common-code ruler node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var inherit = require( "PHET_CORE/inherit" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var RulerNode = require( "SCENERY_PHET/RulerNode" );

  /**
   * @param {Ruler} ruler
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BLLRulerNode( ruler, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // Compute tick labels, 1 major tick for every 0.5 unit of length, labels on the ticks that correspond to integer values.
    var majorTickLabels = new Array();
    var numberOfTicks = ( 2 * ruler.length ) + 1;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[i] = ( i % 2 == 0 ) ? ( i / 2 ).toFixed( 0 ) : "";
    }

    // use the common ruler node
    var width = mvt.modelToViewDeltaX( ruler.length );
    var height = mvt.modelToViewDeltaY( ruler.height );
    thisNode.addChild( new RulerNode( width, height, majorTickLabels, BLLStrings.units_centimeters,
                                      { minorTicksPerMajorTick: 4 } ) );

    // sync with model
    ruler.location.addObserver( function ( location ) {
      var position = mvt.modelToViewPosition( location );
      thisNode.x = position.x;
      thisNode.y = position.y;
    } );

    // interactivity
    thisNode.cursor = "pointer";
    thisNode.addInputListener( new MovableDragHandler( ruler, mvt ) );
  }

  inherit( BLLRulerNode, Node );

  return BLLRulerNode;
} );
