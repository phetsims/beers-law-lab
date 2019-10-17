// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for ShakerParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const merge = require( 'PHET_CORE/merge' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  const SoluteParticleIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticleIO' );
  const validate = require( 'AXON/validate' );
  const Vector2IO = require( 'DOT/Vector2IO' );

  class ShakerParticleIO extends SoluteParticleIO {

    /**
     * Serializes an instance.
     * @param {ShakerParticle} shakerParticle
     * @returns {Object}
     */
    static toStateObject( shakerParticle ) {
      validate( shakerParticle, this.validator );
      const soluteParticle = SoluteParticleIO.toStateObject( shakerParticle );
      return merge( soluteParticle, {
        solute: SoluteIO.toStateObject( shakerParticle.solute ),
        velocity: Vector2IO.toStateObject( shakerParticle.velocity ),
        acceleration: Vector2IO.toStateObject( shakerParticle.acceleration )
      } );
    }

    /**
     * Deserializes an instance.
     * @param {Object} stateObject
     * @returns {ShakerParticle}
     */
    static fromStateObject( stateObject ) {
      const soluteParticle = SoluteParticleIO.fromStateObject( stateObject );
      return merge( soluteParticle, {
        solute: SoluteIO.fromStateObject( stateObject.solute ),
        velocity: Vector2IO.fromStateObject( stateObject.velocity ),
        acceleration: Vector2IO.fromStateObject( stateObject.acceleration )
      } );
    }
  }

  ShakerParticleIO.documentation = 'A particle that comes from the shaker.';
  ShakerParticleIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.ShakerParticle };
  ShakerParticleIO.typeName = 'ShakerParticleIO';
  ObjectIO.validateSubtype( ShakerParticleIO );

  return beersLawLab.register( 'ShakerParticleIO', ShakerParticleIO );
} );

