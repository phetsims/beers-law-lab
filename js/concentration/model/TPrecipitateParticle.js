// Copyright 2017, University of Colorado Boulder

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
  var TVector2 = require( 'DOT/TVector2' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TPrecipitateParticle( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.PrecipitateParticle );
    TObject.call( this, instance, phetioID );
  }

  phetioInherit( TObject, 'TPrecipitateParticle', TPrecipitateParticle, {}, {

    fromStateObject: function( stateObject ) {
      return {
        solute: TSolute.fromStateObject( stateObject.solute ),
        location: TVector2.fromStateObject( stateObject.location ),
        orientation: TNumber.fromStateObject( stateObject.orientation )
      };
    },

    toStateObject: function( value ) {
      return {
        solute: TSolute.toStateObject( value.solute ),
        location: TVector2.toStateObject( value.locationProperty.get() ),
        orientation: TNumber.toStateObject( value.orientation )
      };
    },
    documentation: 'A particle that shows at the bottom of a saturated solution.'
  } );

   beersLawLab.register( 'TPrecipitateParticle', TPrecipitateParticle );

  return TPrecipitateParticle;
} );

