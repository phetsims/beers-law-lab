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
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var SoluteParticle = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticle' );
  var Vector2IO = require( 'DOT/Vector2IO' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {SoluteParticle} soluteParticle
   * @param {string} phetioID
   * @constructor
   */
  function SoluteParticleIO( soluteParticle, phetioID ) {
    ObjectIO.call( this, soluteParticle, phetioID );
  }

  phetioInherit( ObjectIO, 'SoluteParticleIO', SoluteParticleIO, {}, {
    validator: { valueType: SoluteParticle },

    /**
     * Serializes an instance.  Not called by PhET-iO directly, but rather called from its subtypes.
     * @param soluteParticle
     * @returns {Object}
     */
    toStateObject: function( soluteParticle ) {
      validate( soluteParticle, this.validator );
      return {
        location: Vector2IO.toStateObject( soluteParticle.locationProperty.get() ),
        orientation: NumberIO.toStateObject( soluteParticle.orientation )
      };
    },

    /**
     * Deserializes an instance.  Not called by PhET-iO directly, but rather called from its subtypes.
     * @param {Object} stateObject
     * @returns {{location: Vector2, orientation: number}}
     */
    fromStateObject: function( stateObject ) {
      return {
        location: Vector2IO.fromStateObject( stateObject.location ),
        orientation: NumberIO.fromStateObject( stateObject.orientation )
      };
    }
  } );

  beersLawLab.register( 'SoluteParticleIO', SoluteParticleIO );

  return SoluteParticleIO;
} );