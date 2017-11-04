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
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var TSolute = require( 'BEERS_LAW_LAB/concentration/model/TSolute' );
  var TTandem = require( 'TANDEM/TTandem' );
  var TVector2 = require( 'DOT/TVector2' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TShakerParticle( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.ShakerParticle );
    TObject.call( this, instance, phetioID );
  }

  phetioInherit( TObject, 'TShakerParticle', TShakerParticle, {}, {
    documentation: 'A particle that comes from the shaker.',

    fromStateObject: function( stateObject ) {
      return {
        solute: TSolute.fromStateObject( stateObject.solute ),
        location: TVector2.fromStateObject( stateObject.location ),
        orientation: TNumber.fromStateObject( stateObject.orientation ),
        velocity: TVector2.fromStateObject( stateObject.velocity ),
        acceleration: TVector2.fromStateObject( stateObject.acceleration ),
        tandem: TTandem.fromStateObject( stateObject.shakerParticleTandem )
      };
    },

    toStateObject: function( value ) {
      return {
        solute: TSolute.toStateObject( value.solute ),
        location: TVector2.toStateObject( value.locationProperty.get() ),
        orientation: TNumber.toStateObject( value.orientation ),
        velocity: TVector2.toStateObject( value.velocity ),
        acceleration: TVector2.toStateObject( value.acceleration ),
        tandem: TTandem.toStateObject( value.shakerParticleTandem )
      };
    }
  } );

   beersLawLab.register( 'TShakerParticle', TShakerParticle );

  return TShakerParticle;
} );

