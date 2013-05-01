// Copyright 2013, University of Colorado

/**
 * A square plus icon.
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Path = require( "SCENERY/nodes/Path" );
  var Shape = require( "KITE/Shape" );

  function PlusIconNode( width ) {

    var hw = width / 2; // half of width
    var ht = width / 6; // half of the thickness of the plus sign
    var shape = new Shape()  // clockwise from top left
      .moveTo( hw - ht, 0 )
      .lineTo( hw + ht, 0 )
      .lineTo( hw + ht, hw - ht )
      .lineTo( 2 * hw, hw - ht )
      .lineTo( 2 * hw, hw + ht )
      .lineTo( hw + ht, hw + ht )
      .lineTo( hw + ht, 2 * hw )
      .lineTo( hw - ht, 2 * hw )
      .lineTo( hw - ht, hw + ht )
      .lineTo( 0, hw + ht )
      .lineTo( 0, hw - ht )
      .lineTo( hw - ht, hw - ht )
      .close();

    Path.call( this, { shape: shape, fill: "black" } );
  }

  inherit( PlusIconNode, Path );

  return PlusIconNode;
} );