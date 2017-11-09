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

  /**
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TPrecipitateParticle( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.PrecipitateParticle );
    TSoluteParticle.call( this, instance, phetioID );
  }

  phetioInherit( TSoluteParticle, 'TPrecipitateParticle', TPrecipitateParticle, {}, {

    fromStateObject: function( stateObject ) {
      var soluteParticle = TSoluteParticle.fromStateObject( stateObject );
      return _.extend( soluteParticle, { solute: TSolute.fromStateObject( stateObject.solute ) } );
    },

    toStateObject: function( value ) {
      var soluteParticle = TSoluteParticle.toStateObject( value );
      return _.extend( soluteParticle, { solute: TSolute.toStateObject( value.solute ) } );
    },
    documentation: 'A particle that shows at the bottom of a saturated solution.'
  } );

  beersLawLab.register( 'TPrecipitateParticle', TPrecipitateParticle );

  return TPrecipitateParticle;
} );

