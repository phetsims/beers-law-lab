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
  var TSolute = require( 'BEERS_LAW_LAB/concentration/model/TSolute' );
  var TSoluteParticle = require( 'BEERS_LAW_LAB/concentration/model/TSoluteParticle' );
  var TVector2 = require( 'DOT/TVector2' );

  /**
   * @param {ShakerParticle} shakerParticle
   * @param {string} phetioID
   * @constructor
   */
  function TShakerParticle( shakerParticle, phetioID ) {
    assert && assertInstanceOf( shakerParticle, phet.beersLawLab.ShakerParticle );
    TSoluteParticle.call( this, shakerParticle, phetioID );
  }

  phetioInherit( TSoluteParticle, 'TShakerParticle', TShakerParticle, {}, {
    documentation: 'A particle that comes from the shaker.',

    fromStateObject: function( stateObject ) {
      var soluteParticle = TSoluteParticle.fromStateObject( stateObject );
      return _.extend( soluteParticle, {
        solute: TSolute.fromStateObject( stateObject.solute ),
        velocity: TVector2.fromStateObject( stateObject.velocity ),
        acceleration: TVector2.fromStateObject( stateObject.acceleration )
      } );
    },

    toStateObject: function( shakerParticle ) {
      var soluteParticle = TSoluteParticle.toStateObject( shakerParticle );
      return _.extend( soluteParticle, {
        solute: TSolute.toStateObject( shakerParticle.solute ),
        velocity: TVector2.toStateObject( shakerParticle.velocity ),
        acceleration: TVector2.toStateObject( shakerParticle.acceleration )
      } );
    }
  } );

  beersLawLab.register( 'TShakerParticle', TShakerParticle );

  return TShakerParticle;
} );

