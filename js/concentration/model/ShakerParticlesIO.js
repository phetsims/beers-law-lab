// Copyright 2017, University of Colorado Boulder

/**
 * IO type for ShakerParticles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ShakerParticle = require( 'BEERS_LAW_LAB/concentration/model/ShakerParticle' );
  var ShakerParticleIO = require( 'BEERS_LAW_LAB/concentration/model/ShakerParticleIO' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

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
     * Overrides the super type toStateObject (which was grabbing JSON for the entire instance) to return an empty instance.
     * The state is set through child instances and composition.
     * @returns {Object}
     */
    toStateObject: function() {return {};},

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
      assert && assert( value.acceleration instanceof Vector2, 'acceleration should be a Vector2' );

      shakerParticles.addParticle( new ShakerParticle(
        value.solute,
        value.location,
        value.orientation,
        value.velocity,
        value.acceleration, {
          tandem: tandem
        }
      ) );

      // Particles.step is not called in playback mode, so this needs to be called explicitly to update the view.
      shakerParticles.fireChanged();
    }
  } );

  beersLawLab.register( 'ShakerParticlesIO', ShakerParticlesIO );

  return ShakerParticlesIO;
} );