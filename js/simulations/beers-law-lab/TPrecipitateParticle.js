// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TNumber = require( 'PHET_IO/types/TNumber' );
  var TObject = require( 'PHET_IO/types/TObject' );
  var TSolute = require( 'PHET_IO/simulations/beers-law-lab/TSolute' );
  var TVector2 = require( 'PHET_IO/types/dot/TVector2' );

  var TPrecipitateParticle = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.PrecipitateParticle );
  };

  phetioInherit( TObject, 'TPrecipitateParticle', TPrecipitateParticle, {}, {

    fromStateObject: function( stateObject ) {
      return {
        solute: TSolute.fromStateObject( stateObject.solute ),
        location: TVector2.fromStateObject( stateObject.location ),
        orientation: TNumber().fromStateObject( stateObject.orientation )
      };
    },

    toStateObject: function( value ) {
      return {
        solute: TSolute.toStateObject( value.solute ),
        location: TVector2.toStateObject( value.locationProperty.get() ),
        orientation: TNumber().toStateObject( value.orientation )
      };
    }
  } );

  phetioNamespace.register( 'TPrecipitateParticle', TPrecipitateParticle );

  return TPrecipitateParticle;
} );

