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
  var TNumber = require( 'PHET_IO/types/TNumber' );
  var TSolute = require( 'PHET_IO/simulations/beers-law-lab/TSolute' );
  var TTandem = require( 'PHET_IO/types/tandem/TTandem' );
  var TVector2 = require( 'PHET_IO/types/dot/TVector2' );

  var TShakerParticles = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.ShakerParticles );
  };

  phetioInherit( TObject, 'TShakerParticles', TShakerParticles, {}, {

    clearPhetioInstances: function( instance ) {
      instance.removeAllParticles();
    },

    /**
     * Create a dynamic particle as specified by the phetioID and state.
     * @param {Object} instance
     * @param {Tandem} tandem
     * @param {Object} value
     * @returns {ChargedParticle}
     */
    createPhetioInstance: function( instance, tandem, stateObject ) {

      var value = TShakerParticles.fromStateObject( stateObject );

      assert && assert( value.acceleration instanceof phet.dot.Vector2, 'acceleration should be a Vector2' );

      // solute, location, orientation, initialVelocity, acceleration, tandem
      instance.addParticle( new phet.beersLawLab.ShakerParticle(
        value.solute,
        value.location,
        value.orientation,
        value.velocity,
        value.acceleration,
        tandem
      ) );
      instance.fireParticlesChanged();
    },

    fromStateObject: function( stateObject ) {
      return {
        solute: TSolute.fromStateObject( stateObject.solute ),
        location: TVector2.fromStateObject( stateObject.location ),
        orientation: TNumber().fromStateObject( stateObject.orientation ),
        velocity: TVector2.fromStateObject( stateObject.velocity ),
        acceleration: TVector2.fromStateObject( stateObject.acceleration ),
        tandem: TTandem.fromStateObject( stateObject.tandem )
      };
    }
    // ,
    // toStateObject: function( instance ) {
    //
    //   // TODO: Just returning a string from here doesn't work.... why?
    //   return { phetioID: instance.phetioID };
    // },
    //
    // fromStateObject: function( stateObject ) {
    //   return phetio.getInstance( stateObject.phetioID );
    // },
    //
    // setValue: function( instance, value ) {
    //   instance.removeAllParticles();
    // }

  } );

  phetioNamespace.register( 'TShakerParticles', TShakerParticles );

  return TShakerParticles;
} );

