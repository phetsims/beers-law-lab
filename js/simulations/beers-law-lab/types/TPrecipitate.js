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
  var TObject = require( 'PHET_IO/types/TObject' );

  var TPrecipitate = phetioInherit( TObject, 'TPrecipitate', function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.Precipitate );
  }, {
    setValue: {
      implementation: function() {
        this.instance.removeAllParticles();
      }
    }
  }, {
    toStateObject: function( instance ) {

      // TODO: Just returning a string from here doesn't work.... why?
      return { phetioID: instance.phetioID };
    },
    fromStateObject: function( stateObject ) {
      return phetio.getInstance( stateObject.phetioID );
    }
  } );

  phetioNamespace.register( 'TPrecipitate', TPrecipitate );

  return TPrecipitate;
} );

