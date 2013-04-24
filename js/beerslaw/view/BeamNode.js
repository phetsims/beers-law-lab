// Copyright 2013, University of Colorado

/**
 * Representation of light as a beam.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var Color = require( "common/model/Color" );
  var inherit = require( "PHET_CORE/inherit" );
  var Path = require( "SCENERY/nodes/Path" );

  function BeamNode( beam ) {

    var thisNode = this;
    Path.call( this, { stroke: new Color( 192, 192, 192, 0.8 ).toCSS(), lineWidth: 0.5 } );

    // shape
    beam.shape.addObserver( function ( shape ) {
      thisNode.setShape( shape );
    } );

    // fill
    beam.fill.addObserver( function ( fill ) {
      thisNode.fill = fill;
    } );

    // visibility
    beam.visible.addObserver( function ( visible ) {
      thisNode.setVisible( visible );
    } );
  };

  inherit( BeamNode, Path );

  return BeamNode;
} );