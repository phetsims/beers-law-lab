// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for PrecipitateParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  const SoluteParticleIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticleIO' );
  const validate = require( 'AXON/validate' );

  class PrecipitateParticleIO extends SoluteParticleIO {

    /**
     * Serializes an instance.
     * @param {PrecipitateParticle} precipitateParticle
     * @returns {Object}
     */
    static toStateObject( precipitateParticle ) {
      validate( precipitateParticle, this.validator );
      const soluteParticle = SoluteParticleIO.toStateObject( precipitateParticle );
      return _.extend( soluteParticle, { solute: SoluteIO.toStateObject( precipitateParticle.solute ) } );
    }

    /**
     * Deserializes an instance.
     * @param {Object} stateObject
     * @returns {PrecipitateParticle}
     */
    static fromStateObject( stateObject ) {
      const soluteParticle = SoluteParticleIO.fromStateObject( stateObject );
      return _.extend( soluteParticle, { solute: SoluteIO.fromStateObject( stateObject.solute ) } );
    }
  }

  PrecipitateParticleIO.documentation = 'A particle that shows at the bottom of a saturated solution.';
  PrecipitateParticleIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.PrecipitateParticle };
  PrecipitateParticleIO.typeName = 'PrecipitateParticleIO';
  ObjectIO.validateSubtype( PrecipitateParticleIO );

  return beersLawLab.register( 'PrecipitateParticleIO', PrecipitateParticleIO );
} );

