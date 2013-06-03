// Copyright 2002-2013, University of Colorado

/**
 * Representation of light as a beam.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Color = require( "SCENERY/util/Color" );
  var inherit = require( "PHET_CORE/inherit" );
  var Path = require( "SCENERY/nodes/Path" );

  /**
   * @param {Beam} beam
   * @constructor
   */
  function BeamNode( beam ) {

    var thisNode = this;
    Path.call( this, { stroke: "rgba( 192, 192, 192, 0.8 )", lineWidth: 0.5 } );

    // shape
    beam.shape.link( function( shape ) {
      thisNode.setShape( shape );
    } );

    // fill
    beam.fill.link( function( fill ) {
      thisNode.fill = fill;
    } );

    // visibility
    beam.visible.link( function( visible ) {
      thisNode.setVisible( visible );
    } );
  }

  inherit( BeamNode, Path );

  return BeamNode;
} );