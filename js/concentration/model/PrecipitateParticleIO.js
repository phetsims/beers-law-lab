// Copyright 2017, University of Colorado Boulder

/**
 * IO type for PrecipitateParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  var SoluteParticleIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticleIO' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {PrecipitateParticle} precipitateParticle
   * @param {string} phetioID
   * @constructor
   */
  function PrecipitateParticleIO( precipitateParticle, phetioID ) {
    assert && assertInstanceOf( precipitateParticle, phet.beersLawLab.PrecipitateParticle );
    SoluteParticleIO.call( this, precipitateParticle, phetioID );
  }

  phetioInherit( SoluteParticleIO, 'PrecipitateParticleIO', PrecipitateParticleIO, {}, {

    /**
     * Serializes an instance.
     * @param {PrecipitateParticle} precipitateParticle
     * @returns {Object}
     */
    toStateObject: function( precipitateParticle ) {
      assert && assertInstanceOf( precipitateParticle, phet.beersLawLab.PrecipitateParticle );
      var soluteParticle = SoluteParticleIO.toStateObject( precipitateParticle );
      return _.extend( soluteParticle, { solute: SoluteIO.toStateObject( precipitateParticle.solute ) } );
    },

    /**
     * Deserializes an instance.
     * @param {Object} stateObject
     * @returns {PrecipitateParticle}
     */
    fromStateObject: function( stateObject ) {
      var soluteParticle = SoluteParticleIO.fromStateObject( stateObject );
      return _.extend( soluteParticle, { solute: SoluteIO.fromStateObject( stateObject.solute ) } );
    },

    documentation: 'A particle that shows at the bottom of a saturated solution.'
  } );

  beersLawLab.register( 'PrecipitateParticleIO', PrecipitateParticleIO );

  return PrecipitateParticleIO;
} );

