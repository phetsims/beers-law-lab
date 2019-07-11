// Copyright 2017-2019, University of Colorado Boulder

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
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  var SoluteParticleIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticleIO' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {PrecipitateParticle} precipitateParticle
   * @param {string} phetioID
   * @constructor
   */
  function PrecipitateParticleIO( precipitateParticle, phetioID ) {
    SoluteParticleIO.call( this, precipitateParticle, phetioID );
  }

  phetioInherit( SoluteParticleIO, 'PrecipitateParticleIO', PrecipitateParticleIO, {}, {

    /**
     * Serializes an instance.
     * @param {PrecipitateParticle} precipitateParticle
     * @returns {Object}
     */
    toStateObject: function( precipitateParticle ) {
      validate( precipitateParticle, this.validator );
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

    documentation: 'A particle that shows at the bottom of a saturated solution.',
    validator: { isValidValue: v => v instanceof phet.beersLawLab.PrecipitateParticle }
  } );

  beersLawLab.register( 'PrecipitateParticleIO', PrecipitateParticleIO );

  return PrecipitateParticleIO;
} );

