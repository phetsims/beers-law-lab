// Copyright 2017, University of Colorado Boulder

/**
 * IO type for ShakerParticles.
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ShakerParticleIO = require( 'BEERS_LAW_LAB/concentration/model/ShakerParticleIO' );

  /**
   * @param {ShakerParticles} shakerParticles
   * @param {string} phetioID
   * @constructor
   */
  function ShakerParticlesIO( shakerParticles, phetioID ) {
    assert && assertInstanceOf( shakerParticles, phet.beersLawLab.ShakerParticles );
    ObjectIO.call( this, shakerParticles, phetioID );
  }

  phetioInherit( ObjectIO, 'ShakerParticlesIO', ShakerParticlesIO, {}, {

    documentation: 'Base type for a group of particles.',

    /**
     * Clears the children from the model so it can be deserialized.
     * @param {ShakerParticles} shakerParticles
     */
    clearChildInstances: function( shakerParticles ) {
      assert && assertInstanceOf( shakerParticles, phet.beersLawLab.ShakerParticles );

      shakerParticles.removeAllParticles();

      // Particles.step is not called in playback mode, so this needs to be called explicitly to update the view.
      shakerParticles.fireChanged();
    },

    /**
     * Create a dynamic particle as specified by the phetioID and state.
     * @param {ShakerParticles} shakerParticles
     * @param {Tandem} tandem
     * @param {Object} stateObject
     * @returns {ChargedParticle}
     */
    addChildInstance: function( shakerParticles, tandem, stateObject ) {
      assert && assertInstanceOf( shakerParticles, phet.beersLawLab.ShakerParticles );

      var value = ShakerParticleIO.fromStateObject( stateObject );
      assert && assert( value.acceleration instanceof phet.dot.Vector2, 'acceleration should be a Vector2' );

      shakerParticles.addParticle( new phet.beersLawLab.ShakerParticle(
        value.solute,
        value.location,
        value.orientation,
        value.velocity,
        value.acceleration,
        tandem
      ) );

      // Particles.step is not called in playback mode, so this needs to be called explicitly to update the view.
      shakerParticles.fireChanged();
    }
  } );

  beersLawLab.register( 'ShakerParticlesIO', ShakerParticlesIO );

  return ShakerParticlesIO;
} );