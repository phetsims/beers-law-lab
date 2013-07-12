// Copyright 2002-2013, University of Colorado Boulder

/**
 * A node that is created for a specific width by horizontally tiling a set of nodes.
 * The left and right nodes can be thought of as 'book ends', with the center node tiled to fill the space in the middle.
 * This allows us to create (for example) control panels that have 3D-looking backgrounds, but can adjust to fit i18n.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'beers-law-lab' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var X_OVERLAP = 1; // overlap between tiles, to hide seams

  /**
   * @param {Number} totalWidth
   * @param {Node} leftImage
   * @param {Node} centerImage
   * @param {Node} rightImage
   * @constructor
   */
  function HorizontalTiledNode( totalWidth, leftImage, centerImage, rightImage ) {

    assert && assert( leftImage.height === centerImage.height && centerImage.height === rightImage.height );
    assert && assert( ( leftImage.width + rightImage.width ) <= totalWidth );  // center may be unused

    var thisNode = this;
    Node.call( thisNode );

    // left
    var leftNode = new Image( leftImage );
    thisNode.addChild( leftNode );

    // right
    var rightNode = new Image( rightImage );
    rightNode.right = totalWidth;
    thisNode.addChild( rightNode );

    // tile the center, with overlap between tiles to hide seams
    var tiledWidth = totalWidth - leftNode.width - rightNode.width + ( 2 * X_OVERLAP );
    var centerNode = new Rectangle( 0, 0, tiledWidth, centerImage.height, { fill: new Pattern( centerImage ) } );
    centerNode.left = leftNode.right - X_OVERLAP;
    thisNode.addChild( centerNode );
  }

  inherit( Node, HorizontalTiledNode );

  return HorizontalTiledNode;
} );
