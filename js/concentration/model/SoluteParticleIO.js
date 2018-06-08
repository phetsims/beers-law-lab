// Copyright 2017, University of Colorado Boulder

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
  var Vector2IO = require( 'DOT/Vector2IO' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var NumberIO = require( 'ifphetio!PHET_IO/types/NumberIO' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {SoluteParticle} soluteParticle
   * @param {string} phetioID
   * @constructor
   */
  function SoluteParticleIO( soluteParticle, phetioID ) {
    assert && assertInstanceOf( soluteParticle, phet.beersLawLab.SoluteParticle );
    ObjectIO.call( this, soluteParticle, phetioID );
  }

  phetioInherit( ObjectIO, 'SoluteParticleIO', SoluteParticleIO, {}, {

    /**
     * Serializes an instance.  Not called by PhET-iO directly, but rather called from its subtypes.
     * @param soluteParticle
     * @returns {Object}
     */
    toStateObject: function( soluteParticle ) {
      assert && assertInstanceOf( soluteParticle, phet.beersLawLab.SoluteParticle );
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