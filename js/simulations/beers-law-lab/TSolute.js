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
  var TObject = require( 'PHET_IO/types/TObject' );
  var TString = require( 'PHET_IO/types/TString' );
  var TVoid = require( 'PHET_IO/types/TVoid' );
  var phetio = require( 'PHET_IO/phetio' );

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

  phetioNamespace.register( 'TSolute', TSolute );

  return TSolute;
} );

