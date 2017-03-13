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
  var TArray = require( 'ifphetio!PHET_IO/types/TArray' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var TSolute = require( 'BEERS_LAW_LAB/concentration/model/TSolute' );
  var TVoid = require( 'ifphetio!PHET_IO/types/TVoid' );

  var TConcentrationModel = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.ConcentrationModel );
  };

  phetioInherit( TObject, 'TConcentrationModel', TConcentrationModel, {

    // For instance:
    // http://localhost/concentration/concentration_en.html?ea&brand=phet-io&phetioStandalone&phetioLog=lines&phetioExpressions=[["concentration.concentrationScreen.model","setSolutes",[["concentration.solutes.cobaltIINitrate","concentration.solutes.cobaltChloride","concentration.solutes.drinkMix"]]]]
    setSolutes: {
      parameterTypes: [ TArray( TSolute ) ],
      returnType: TVoid,
      implementation: function( solutes ) {
        this.instance.setSolutes( solutes );
      },
      documentation: 'Set which solutes are allowed for selection'
    }
  }, {} );

   beersLawLab.register( 'TConcentrationModel', TConcentrationModel );

  return TConcentrationModel;
} );

