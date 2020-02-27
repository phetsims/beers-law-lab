// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for ShakerParticles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import beersLawLab from '../../beersLawLab.js';
import ShakerParticle from './ShakerParticle.js';
import ShakerParticleIO from './ShakerParticleIO.js';

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
  static addChildInstanceDeprecated( shakerParticles, tandem, stateObject ) {
    validate( shakerParticles, this.validator );

    const value = ShakerParticleIO.fromStateObject( stateObject );
    assert && assert( value.acceleration instanceof Vector2, 'acceleration should be a Vector2' );

    const shakerParticle = new ShakerParticle(
      value.solute,
      value.position,
      value.orientation,
      value.velocity,
      value.acceleration, {
        tandem: tandem
      }
    );
    shakerParticles.addParticle( shakerParticle );

    // Particles.step is not called in playback mode, so this needs to be called explicitly to update the view.
    shakerParticles.fireChanged();
    return shakerParticle;
  }
}

ShakerParticlesIO.documentation = 'Base type for a group of particles.';
ShakerParticlesIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.ShakerParticles };
ShakerParticlesIO.typeName = 'ShakerParticlesIO';
ObjectIO.validateSubtype( ShakerParticlesIO );

beersLawLab.register( 'ShakerParticlesIO', ShakerParticlesIO );
export default ShakerParticlesIO;