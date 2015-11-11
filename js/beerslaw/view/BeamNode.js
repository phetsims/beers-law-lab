// Copyright 2013-2015, University of Colorado Boulder

/**
 * Representation of light as a beam.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   * @param {Beam} beam
   * @constructor
   */
  function BeamNode( beam ) {

    var thisNode = this;
    Path.call( this, null, { stroke: 'rgba( 192, 192, 192, 0.8 )', lineWidth: 0.5, pickable: false } );

    // shape
    beam.shapeProperty.link( function( shape ) {
      thisNode.setShape( shape );
    } );

    // fill
    beam.fillProperty.link( function( fill ) {
      thisNode.fill = fill;
    } );

    // visibility
    beam.visibleProperty.link( function( visible ) {
      thisNode.setVisible( visible );
    } );
  }

  beersLawLab.register( 'BeamNode', BeamNode );

  return inherit( Path, BeamNode );
} );