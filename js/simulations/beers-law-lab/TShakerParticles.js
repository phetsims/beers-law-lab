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
  var TVoid = require( 'PHET_IO/types/TVoid' );
  var phetio = require( 'PHET_IO/phetio' );

  var TShakerParticles = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.ShakerParticles );
  };

  phetioInherit( TObject, 'TShakerParticles', TShakerParticles, {

    // TODO: rename this to a more specific name
    // setValue: {
    //   returnType: TVoid,
    //   parameterTypes: [],
    //   implementation: function() {
    //     this.instance.removeAllParticles();
    //   },
    //   documentation: 'Set the formula of the solute'
    // }
  }, {
    toStateObject: function( instance ) {

      // TODO: Just returning a string from here doesn't work.... why?
      return { phetioID: instance.phetioID };
    },

    fromStateObject: function( stateObject ) {
      return phetio.getInstance( stateObject.phetioID );
    }
  } );

  phetioNamespace.register( 'TShakerParticles', TShakerParticles );

  return TShakerParticles;
} );

