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
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );
  var TVoid = require( 'ifphetio!PHET_IO/types/TVoid' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );

  var TSolute = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.Solute );
  };

  phetioInherit( TObject, 'TSolute', TSolute, {

    setName: {
      returnType: TVoid,
      parameterTypes: [ TString ],
      implementation: function( text ) {
        this.instance.name = text;
      },
      documentation: 'Set the name of the solute'
    },

    setFormula: {
      returnType: TVoid,
      parameterTypes: [ TString ],
      implementation: function( text ) {
        this.instance.formula = text;
      },
      documentation: 'Set the formula of the solute'
    }
  }, {

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

