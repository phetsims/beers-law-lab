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
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );
  var VoidIO = require( 'ifphetio!PHET_IO/types/VoidIO' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TSolute( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.Solute );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'TSolute', TSolute, {

    setName: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( text ) {
        this.instance.name = text;
      },
      documentation: 'Set the name of the solute'
    },

    setFormula: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( text ) {
        this.instance.formula = text;
      },
      documentation: 'Set the formula of the solute'
    }
  }, {
    documentation: 'The Solute for the sim.',

    fromStateObject: function( stateObject ) {
      return phetio.getWrapper( stateObject ).instance;
    },

    toStateObject: function( instance ) {
      return instance.phetioID;
    }
  } );

   beersLawLab.register( 'TSolute', TSolute );

  return TSolute;
} );

