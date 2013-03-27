// Copyright 2002-2013, University of Colorado

/**
 * To debug a node's origin, add an instance of this node as a child.
 * Be careful not to change this node's position, leave it at (0,0).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Path = require( "SCENERY/nodes/Path" );
  var Shape = require( "KITE/Shape" );

  function DebugOriginNode( color ) {
    Path.call( this, {
      shape: Shape.circle( 0, 0, 3 ),
      fill: color
    } );
  }

  inherit( DebugOriginNode, Path );

  return DebugOriginNode;
} );
