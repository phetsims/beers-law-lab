// Copyright 2013-2016, University of Colorado Boulder

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

    var self = this;
    Path.call( this, null, { stroke: 'rgba( 192, 192, 192, 0.8 )', lineWidth: 0.5, pickable: false } );

    // shape
    beam.shapeProperty.link( function( shape ) {
      self.setShape( shape );
    } );

    // fill
    beam.fillProperty.link( function( fill ) {
      self.fill = fill;
    } );

    // visibility
    beam.visibleProperty.link( function( visible ) {
      self.setVisible( visible );
    } );
  }

  beersLawLab.register( 'BeamNode', BeamNode );

  return inherit( Path, BeamNode );
} );