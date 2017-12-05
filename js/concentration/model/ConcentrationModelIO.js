// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrayIO = require( 'ifphetio!PHET_IO/types/ArrayIO' );
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  var VoidIO = require( 'ifphetio!PHET_IO/types/VoidIO' );

  /**
   * 
   * @param instance
   * @param phetioID
   * @constructor
   */
  function ConcentrationModelIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.ConcentrationModel );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'ConcentrationModelIO', ConcentrationModelIO, {

    // For instance:
    // http://localhost/concentration/concentration_en.html?ea&brand=phet-io&phetioStandalone&phetioLog=lines
    setSolutes: {
      parameterTypes: [ ArrayIO( SoluteIO ) ],
      returnType: VoidIO,
      implementation: function( solutes ) {
        this.instance.setSolutes( solutes );
      },
      documentation: 'Set which solutes are allowed for selection'
    }
  }, { documentation: 'The model for the concentration screen.' } );

  beersLawLab.register( 'ConcentrationModelIO', ConcentrationModelIO );

  return ConcentrationModelIO;
} );
