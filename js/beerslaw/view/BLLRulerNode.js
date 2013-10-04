// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of the ruler.
 * This is a wrapper around the common-code ruler node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'BEERS_LAW_LAB/common/view/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var Shape = require( 'KITE/Shape' );
  var units_centimetersString = require( 'string!BEERS_LAW_LAB/units_centimeters' );

  /**
   * @param {Ruler} ruler
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BLLRulerNode( ruler, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // Compute tick labels, 1 major tick for every 0.5 unit of length, labels on the ticks that correspond to integer values.
    var majorTickLabels = [];
    var numberOfTicks = Math.floor( ruler.length / 0.5 ) + 1;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[i] = ( i % 2 === 0 ) ? ( i / 2 ) : '';
    }

    // use the common ruler node
    var width = mvt.modelToViewDeltaX( ruler.length );
    var height = mvt.modelToViewDeltaY( ruler.height );
    var majorTickWidth = mvt.modelToViewDeltaX( 0.5 );
    thisNode.addChild( new RulerNode( width, height, majorTickWidth, majorTickLabels, units_centimetersString,
      { minorTicksPerMajorTick: 4, insetsWidth: 0 } ) );

    // touch area
    var dx = 0.05 * thisNode.width;
    var dy = 0.5 * thisNode.height;
    thisNode.touchArea = Shape.rectangle( -dx, -dy, thisNode.width + dx + dx, thisNode.height + dy + dy );

    // sync with model
    ruler.location.link( function( location ) {
      var position = mvt.modelToViewPosition( location );
      thisNode.x = position.x;
      thisNode.y = position.y;
    } );

    // interactivity
    thisNode.cursor = 'pointer';
    thisNode.addInputListener( new MovableDragHandler( ruler, mvt ) );
  }

  inherit( Node, BLLRulerNode );

  return BLLRulerNode;
} );
