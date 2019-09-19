// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for ShakerParticles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const ShakerParticle = require( 'BEERS_LAW_LAB/concentration/model/ShakerParticle' );
  const ShakerParticleIO = require( 'BEERS_LAW_LAB/concentration/model/ShakerParticleIO' );
  const Vector2 = require( 'DOT/Vector2' );
  const validate = require( 'AXON/validate' );

  class ShakerParticlesIO extends ObjectIO {

    /**
     * Overrides the super type toStateObject (which was grabbing JSON for the entire instance) to return an empty instance.
     * The state is set through child instances and composition.
     * @returns {Object}
     */
    static toStateObject() {return {};}

    /**
     * Clears the children from the model so it can be deserialized.
     * @param {ShakerParticles} shakerParticles
     */
    static clearChildInstances( shakerParticles ) {
      validate( shakerParticles, this.validator );

      shakerParticles.removeAllParticles();

      // Particles.step is not called in playback mode, so this needs to be called explicitly to update the view.
      shakerParticles.fireChanged();
    }

    /**
     * Create a dynamic particle as specified by the phetioID and state.
     * @param {ShakerParticles} shakerParticles
     * @param {Tandem} tandem
     * @param {Object} stateObject
     * @returns {ChargedParticle}
     */
    static addChildInstance( shakerParticles, tandem, stateObject ) {
      validate( shakerParticles, this.validator );

      const value = ShakerParticleIO.fromStateObject( stateObject );
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
  }

  ShakerParticlesIO.documentation = 'Base type for a group of particles.';
  ShakerParticlesIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.ShakerParticles };
  ShakerParticlesIO.typeName = 'ShakerParticlesIO';
  ObjectIO.validateSubtype( ShakerParticlesIO );

  return beersLawLab.register( 'ShakerParticlesIO', ShakerParticlesIO );
} );