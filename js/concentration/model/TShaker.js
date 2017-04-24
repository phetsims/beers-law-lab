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
  var TVector2 = require( 'DOT/TVector2' );
  var TVoid = require( 'ifphetio!PHET_IO/types/TVoid' );

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
    documentation: 'The Shaker that releases solute',

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

   beersLawLab.register( 'TShaker', TShaker );

  return TShaker;
} );

