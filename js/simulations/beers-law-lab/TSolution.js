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
  var phetio = require( 'PHET_IO/phetio' );

  var TSolution = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.BeersLawSolution );
  };

  phetioInherit( TObject, 'TSolution', TSolution, {}, {

    // Because the simulation has a Property that contains BeersLawSolution, the Property relies on these methods for saving and loading the values.
    fromStateObject: function( stateObject ) {
      return phetio.getWrapper( stateObject ).instance;
    },

    toStateObject: function( instance ) {
      return instance.phetioID;
    },

    // TODO: get rid of setValue functions that are empty
    setValue: function( what ) {
      // huh?
    }
  } );

  phetioNamespace.register( 'TSolution', TSolution );

  return TSolution;
} );

