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
  var TVector2 = require( 'PHET_IO/types/dot/TVector2' );
  var TVoid = require( 'PHET_IO/types/TVoid' );

  var TShaker = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.Shaker );
  };

  phetioInherit( TObject, 'TShaker', TShaker, {

    setValue: {
      returnType: TVoid,
      parameterTypes: [ TObject ],
      implementation: function( value ) {
        this.instance.previousLocation.set( TVector2.fromStateObject( value ) );
      },
      documentation: 'Load the values recorded in getState'
    }
  }, {

    toStateObject: function( instance ) {
      return TVector2.toStateObject( instance.previousLocation );
    },

    fromStateObject: function( vector2StateObject ) {
      return TVector2.fromStateObject( vector2StateObject ); // no coercion necessary for a plain object with primitives
    },

    setValue: function( instance, value ) {
      instance.previousLocation.set( value );
    }
  } );

  phetioNamespace.register( 'TShaker', TShaker );

  return TShaker;
} );

