// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var TSolute = require( 'BEERS_LAW_LAB/concentration/model/TSolute' );
  var TTandem = require( 'ifphetio!PHET_IO/types/tandem/TTandem' );
  var TVector2 = require( 'DOT/TVector2' );

  var TShakerParticle = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.ShakerParticle );
  };

  phetioInherit( TObject, 'TShakerParticle', TShakerParticle, {}, {

    fromStateObject: function( stateObject ) {
      return {
        solute: TSolute.fromStateObject( stateObject.solute ),
        location: TVector2.fromStateObject( stateObject.location ),
        orientation: TNumber().fromStateObject( stateObject.orientation ),
        velocity: TVector2.fromStateObject( stateObject.velocity ),
        acceleration: TVector2.fromStateObject( stateObject.acceleration ),
        tandem: TTandem.fromStateObject( stateObject.tandem )
      };
    },

    toStateObject: function( value ) {
      return {
        solute: TSolute.toStateObject( value.solute ),
        location: TVector2.toStateObject( value.locationProperty.get() ),
        orientation: TNumber().toStateObject( value.orientation ),
        velocity: TVector2.toStateObject( value.velocity ),
        acceleration: TVector2.toStateObject( value.acceleration ),
        tandem: TTandem.toStateObject( value.tandem )
      };
    }
  } );

   beersLawLab.register( 'TShakerParticle', TShakerParticle );

  return TShakerParticle;
} );

