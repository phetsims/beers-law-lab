// Copyright 2017-2018, University of Colorado Boulder

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
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  var SoluteParticleIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticleIO' );
  var Vector2IO = require( 'DOT/Vector2IO' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {ShakerParticle} shakerParticle
   * @param {string} phetioID
   * @constructor
   */
  function ShakerParticleIO( shakerParticle, phetioID ) {
    SoluteParticleIO.call( this, shakerParticle, phetioID );
  }

  phetioInherit( SoluteParticleIO, 'ShakerParticleIO', ShakerParticleIO, {}, {
    documentation: 'A particle that comes from the shaker.',
    validator: { isValidValue: v => v instanceof phet.beersLawLab.ShakerParticle },

    /**
     * Serializes an instance.
     * @param {ShakerParticle} shakerParticle
     * @returns {Object}
     */
    toStateObject: function( shakerParticle ) {
      validate( shakerParticle, this.validator );
      var soluteParticle = SoluteParticleIO.toStateObject( shakerParticle );
      return _.extend( soluteParticle, {
        solute: SoluteIO.toStateObject( shakerParticle.solute ),
        velocity: Vector2IO.toStateObject( shakerParticle.velocity ),
        acceleration: Vector2IO.toStateObject( shakerParticle.acceleration )
      } );
    },

    /**
     * Deserializes an instance.
     * @param {Object} stateObject
     * @returns {ShakerParticle}
     */
    fromStateObject: function( stateObject ) {
      var soluteParticle = SoluteParticleIO.fromStateObject( stateObject );
      return _.extend( soluteParticle, {
        solute: SoluteIO.fromStateObject( stateObject.solute ),
        velocity: Vector2IO.fromStateObject( stateObject.velocity ),
        acceleration: Vector2IO.fromStateObject( stateObject.acceleration )
      } );
    }
  } );

  beersLawLab.register( 'ShakerParticleIO', ShakerParticleIO );

  return ShakerParticleIO;
} );

