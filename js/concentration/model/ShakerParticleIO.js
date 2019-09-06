// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for ShakerParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  var SoluteParticleIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticleIO' );
  var Vector2IO = require( 'DOT/Vector2IO' );
  var validate = require( 'AXON/validate' );

  class ShakerParticleIO extends SoluteParticleIO {

    /**
     * Serializes an instance.
     * @param {ShakerParticle} shakerParticle
     * @returns {Object}
     */
    static toStateObject( shakerParticle ) {
      validate( shakerParticle, this.validator );
      var soluteParticle = SoluteParticleIO.toStateObject( shakerParticle );
      return _.extend( soluteParticle, {
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
      var soluteParticle = SoluteParticleIO.fromStateObject( stateObject );
      return _.extend( soluteParticle, {
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

