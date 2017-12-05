// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  var SoluteParticleIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteParticleIO' );

  /**
   * @param instance
   * @param phetioID
   * @constructor
   */
  function PrecipitateParticleIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.PrecipitateParticle );
    SoluteParticleIO.call( this, instance, phetioID );
  }

  phetioInherit( SoluteParticleIO, 'PrecipitateParticleIO', PrecipitateParticleIO, {}, {

    fromStateObject: function( stateObject ) {
      var soluteParticle = SoluteParticleIO.fromStateObject( stateObject );
      return _.extend( soluteParticle, { solute: SoluteIO.fromStateObject( stateObject.solute ) } );
    },

    toStateObject: function( precipitateParticle ) {
      assert && assertInstanceOf( precipitateParticle, phet.beersLawLab.PrecipitateParticle );
      var soluteParticle = SoluteParticleIO.toStateObject( precipitateParticle );
      return _.extend( soluteParticle, { solute: SoluteIO.toStateObject( precipitateParticle.solute ) } );
    },
    documentation: 'A particle that shows at the bottom of a saturated solution.'
  } );

  beersLawLab.register( 'PrecipitateParticleIO', PrecipitateParticleIO );

  return PrecipitateParticleIO;
} );
