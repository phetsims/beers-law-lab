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
  var TNumber = require( 'PHET_IO/types/TNumber' );
  var TObject = require( 'PHET_IO/types/TObject' );
  var TProperty = require( 'PHET_IO/types/axon/TProperty' );

  var TSolution = phetioInherit( TObject, 'TSolution', function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.BeersLawSolution );
  }, {}, {
    fromStateObject: function( stateObject ) {
      return phetio.getWrapper( stateObject ).instance;
    },
    toStateObject: function( instance ) {
      return instance.phetioID;
    },
    api: {
      concentrationProperty: TProperty( TNumber( 'moles/liter' ) )
    }
  } );

  phetioNamespace.register( 'TSolution', TSolution );

  return TSolution;
} );

