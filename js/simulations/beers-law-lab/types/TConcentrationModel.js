// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TArray = require( 'PHET_IO/types/TArray' );
  var TObject = require( 'PHET_IO/types/TObject' );
  var TSolute = require( 'PHET_IO/simulations/beers-law-lab/types/TSolute' );
  var TVoid = require( 'PHET_IO/types/TVoid' );

  var TConcentrationModel = phetioInherit( TObject, 'TConcentrationModel', function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.ConcentrationModel );
  }, {

    // For instance:
    // http://localhost/concentration/concentration_en.html?ea&brand=phet-io&phet-io.standalone&phet-io.log=lines&phet-io.expressions=[["concentration.concentrationScreen.model","setSolutes",[["concentration.solutes.cobaltIINitrate","concentration.solutes.cobaltChloride","concentration.solutes.drinkMix"]]]]
    setSolutes: {
      parameterTypes: [ TArray( TSolute ) ],
      returnType: TVoid,
      implementation: function( solutes ) {
        this.instance.setSolutes( solutes );
      }
    }
  }, {} );

  phetioNamespace.register( 'TConcentrationModel', TConcentrationModel );

  return TConcentrationModel;
} );

