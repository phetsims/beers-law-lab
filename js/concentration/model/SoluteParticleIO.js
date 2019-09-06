// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for SoluteParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var NumberIO = require( 'TANDEM/types/NumberIO' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var SoluteParticle = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticle' );
  var Vector2IO = require( 'DOT/Vector2IO' );
  var validate = require( 'AXON/validate' );

  class SoluteParticleIO extends ObjectIO {

    /**
     * Serializes an instance.  Not called by PhET-iO directly, but rather called from its subtypes.
     * @param soluteParticle
     * @returns {Object}
     */
    static toStateObject( soluteParticle ) {
      validate( soluteParticle, this.validator );
      return {
        location: Vector2IO.toStateObject( soluteParticle.locationProperty.get() ),
        orientation: NumberIO.toStateObject( soluteParticle.orientation )
      };
    }

    /**
     * Deserializes an instance.  Not called by PhET-iO directly, but rather called from its subtypes.
     * @param {Object} stateObject
     * @returns {{location: Vector2, orientation: number}}
     */
    static fromStateObject( stateObject ) {
      return {
        location: Vector2IO.fromStateObject( stateObject.location ),
        orientation: NumberIO.fromStateObject( stateObject.orientation )
      };
    }
  }

  SoluteParticleIO.validator = { valueType: SoluteParticle };
  SoluteParticleIO.documentation = 'A particle of solute to add to the solution';
  SoluteParticleIO.typeName = 'SoluteParticleIO';
  ObjectIO.validateSubtype( SoluteParticleIO );

  return beersLawLab.register( 'SoluteParticleIO', SoluteParticleIO );
} );