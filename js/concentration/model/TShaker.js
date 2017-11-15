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
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var TVector2 = require( 'DOT/TVector2' );
  var TVoid = require( 'ifphetio!PHET_IO/types/TVoid' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TShaker( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.Shaker );
    TObject.call( this, instance, phetioID );
  }

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
      return { location: TVector2.toStateObject( instance.previousLocation ) };
    },

    fromStateObject: function( stateObject ) {
      return { location: TVector2.fromStateObject( stateObject.location ) };
    },

    setValue: function( instance, valueFromStateObject ) {
      instance.previousLocation.set( valueFromStateObject.location );
    }
  } );

  beersLawLab.register( 'TShaker', TShaker );

  return TShaker;
} );
