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
  var ArrayIO = require( 'ifphetio!PHET_IO/types/ArrayIO' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var TSolute = require( 'BEERS_LAW_LAB/concentration/model/TSolute' );
  var VoidIO = require( 'ifphetio!PHET_IO/types/VoidIO' );

  /**
   * 
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TConcentrationModel( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.ConcentrationModel );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'TConcentrationModel', TConcentrationModel, {

    // For instance:
    // http://localhost/concentration/concentration_en.html?ea&brand=phet-io&phetioStandalone&phetioLog=lines
    setSolutes: {
      parameterTypes: [ ArrayIO( TSolute ) ],
      returnType: VoidIO,
      implementation: function( solutes ) {
        this.instance.setSolutes( solutes );
      },
      documentation: 'Set which solutes are allowed for selection'
    }
  }, { documentation: 'The model for the concentration screen.' } );

  beersLawLab.register( 'TConcentrationModel', TConcentrationModel );

  return TConcentrationModel;
} );

