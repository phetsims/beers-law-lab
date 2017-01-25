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
  var TPrecipitateParticle = require( 'PHET_IO/simulations/beers-law-lab/TPrecipitateParticle' );

  var TPrecipitate = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.Precipitate );
  };

  phetioInherit( TObject, 'TPrecipitate', TPrecipitate, {}, {

    clearChildInstances: function( instance ) {
      instance.removeAllParticles();
      instance.fireChanged();
    },

    /**
     * Adds a precipitate particle as specified by the phetioID and state.
     * @param {Object} instance
     * @param {Tandem} tandem
     * @param {Object} stateObject
     */
    addChildInstance: function( instance, tandem, stateObject ) {

      var value = TPrecipitateParticle.fromStateObject( stateObject );

      instance.particles.push( new phet.beersLawLab.PrecipitateParticle(
        value.solute,
        value.location,
        value.orientation,
        tandem
      ) );
      instance.fireChanged();
    }

  } );

  phetioNamespace.register( 'TPrecipitate', TPrecipitate );

  return TPrecipitate;
} );

