// Copyright 2013, University of Colorado

/**
 * Visual representation of the ruler.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Ruler} ruler
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function RulerNode( ruler, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    var w = mvt.modelToViewDeltaX( ruler.length );
    var h = mvt.modelToViewDeltaY( ruler.height );
    thisNode.addChild( new Rectangle( 0, 0, w, h, { fill: 'rgb(232,222,73)', stroke: 'black' } ) );

    //TODO ticks, labels, insets, etc.

    // sync with model
    ruler.location.addObserver( function( location ) {
      var position = mvt.modelToViewPosition( location );
      thisNode.x = position.x;
      thisNode.y = position.y;
    });

    // interactivity
    thisNode.cursor = "pointer";
    thisNode.addInputListener( new MovableDragHandler( ruler, mvt ) );
  }

  inherit( RulerNode, Node );

  return RulerNode;
});
