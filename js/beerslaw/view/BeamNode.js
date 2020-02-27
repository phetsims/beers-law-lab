// Copyright 2013-2019, University of Colorado Boulder

/**
 * Representation of light as a beam.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const Path = require( 'SCENERY/nodes/Path' );

  class BeamNode extends Path {

    /**
     * @param {Beam} beam
     */
    constructor( beam ) {

      super( null, { stroke: 'rgba( 192, 192, 192, 0.8 )', lineWidth: 0.5, pickable: false } );

      // shape
      beam.shapeProperty.link( shape => this.setShape( shape ) );

      // fill
      beam.fillProperty.link( fill => {
        this.fill = fill;
      } );

      // visibility
      beam.visibleProperty.link( visible => this.setVisible( visible ) );
    }
  }

  return beersLawLab.register( 'BeamNode', BeamNode );
} );