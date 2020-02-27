// Copyright 2013-2020, University of Colorado Boulder

/**
 * One particle that makes up the precipitate that forms on the bottom of the beaker.
 * Precipitate particles are static (they don't move). They have no associated animation,
 * and they magically appear on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const merge = require( 'PHET_CORE/merge' );
  const PrecipitateParticleIO = require( 'BEERS_LAW_LAB/concentration/model/PrecipitateParticleIO' );
  const SoluteParticle = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticle' );

  class PrecipitateParticle extends SoluteParticle {

    /**
     * @param {Solute} solute
     * @param {Vector2} position position in the beaker's coordinate frame
     * @param {number} orientation in radians
     * @param {Object} [options]
     */
    constructor( solute, position, orientation, options ) {

      options = merge( {
        phetioType: PrecipitateParticleIO
      }, options );

      super( solute.particleColor, solute.particleSize, position, orientation, options );

      // @public (phet-io)
      this.solute = solute;
    }
  }

  return beersLawLab.register( 'PrecipitateParticle', PrecipitateParticle );
} );
