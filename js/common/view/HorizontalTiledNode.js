// Copyright 2002-2013, University of Colorado Boulder

/**
 * A node that is created for a specific width by horizontally tiling a set of nodes.
 * The left and right nodes can be thought of as "book ends", with the center node tiled to fill the space in the middle.
 * This allows us to create (for example) control panels that have 3D-looking backgrounds, but can adjust to fit i18n.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );

  // constants
  var X_OVERLAP = 1; // overlap between tiles, to hide seams

  /**
   * @param {Number} totalWidth
   * @param {Node} leftNode
   * @param {Node} centerNode
   * @param {Node} rightNode
   * @constructor
   */
  function HorizontalTiledNode( totalWidth, leftNode, centerNode, rightNode ) {

    assert && assert( leftNode.height === centerNode.height && centerNode.height === rightNode.height );
    assert && assert( ( leftNode.width + centerNode.width + rightNode.width ) <= totalWidth );

    var thisNode = this;
    Node.call( thisNode );

    // compute the number of tiles required to fill the center
    var tiledWidth = totalWidth - leftNode.width - rightNode.width + ( 2 * X_OVERLAP );

    var parentNode = new Node();

    // left
    parentNode.addChild( leftNode );

    // right
    parentNode.addChild( rightNode );
    rightNode.x = totalWidth - rightNode.width;

    // tile the center, with overlap between tiles to hide seams
    var previousNode = leftNode;
    while ( tiledWidth > 0 ) {
      // scenery allows nodes to be in the graph multiple times, but not as siblings, so create a parent.
      var tileNode = new Node();
      tileNode.addChild( centerNode );
      parentNode.addChild( tileNode );
      tileNode.x = previousNode.right - X_OVERLAP;
      // If tile extends too far into right side, shift the tile to the left.
      if ( tileNode.getRight() > rightNode.getLeft() + X_OVERLAP ) {
        tileNode.x = rightNode.left + X_OVERLAP - tileNode.width;
      }
      tiledWidth = tiledWidth - centerNode.width + X_OVERLAP;
      previousNode = tileNode;
    }

    thisNode.addChild( parentNode );
  }

  inherit( Node, HorizontalTiledNode );

  return HorizontalTiledNode;
} );
