// Copyright 2002-2013, University of Colorado

/**
 * A node that is created for a specific width by horizontally tiling a set of nodes.
 * The left and right nodes can be thought of as "book ends", with the center node tiled to fill the space in the middle.
 * This allows us to create (for example) control panels that have 3D-looking backgrounds, but can adjust to fit i18n.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Node = require( "SCENERY/nodes/Node" );
  var Image = require( "SCENERY/nodes/Image" );

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

    var thisNode = this;
    Node.call( thisNode );

    //TODO replace with assert
    // validate args
    if ( leftNode.height != centerNode.height || centerNode.height != rightNode.height ) {
      throw "all images must have the same height";
    }
    if ( ( leftNode.width + centerNode.width + rightNode.width ) > totalWidth ) {
      throw "combined images exceed totalWidth";
    }

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
      tileNode.x = previousNode.getRight() - X_OVERLAP;
      // If tile extends too far into right side, shift the tile to the left.
      if ( tileNode.getRight() > rightNode.getLeft() + X_OVERLAP ) {
        tileNode.x = rightNode.getLeft() + X_OVERLAP - tileNode.width;
      }
      tiledWidth = tiledWidth - centerNode.width + X_OVERLAP;
      previousNode = tileNode;
    }

    thisNode.addChild( parentNode );//TODO subtype Image, setImage( parentNode.toImage )
  }

  Inheritance.inheritPrototype( HorizontalTiledNode, Node );

  return HorizontalTiledNode;
} );
