// Copyright 2013, University of Colorado

/**
 * A square minus icon.
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  function MinusIconNode( width) {
    Node.call( this );
    var thickness = 0.3 * width;
    this.addChild( new Rectangle( 0, 0, width, width ) );
    this.addChild( new Rectangle( 0, ( width - thickness ) / 2, width, thickness, { fill: "black" } ) );
  }

  inherit( MinusIconNode, Node );

  return MinusIconNode;
} );